/**
 * PostToolUse hook: run `eslint --fix` on the file Claude Code just wrote, then
 * report whatever could not be fixed back to the agent.
 *
 * Claude Code delivers hook input as JSON on stdin, so the path is read from
 * there rather than from an argument.
 *
 * ESLint 9 resolves configuration from cwd, not from the linted file. Running
 * from the repository root would therefore lint an Angular component against the
 * root ruleset and silently skip every `@angular-eslint` rule. Rather than opt
 * into the experimental `v10_config_lookup_from_file` flag, this walks up from
 * the file to the nearest `eslint.config.mjs` and runs from that directory —
 * which is what Nx already does when it runs `eslint .` per project. Verified to
 * produce an identical rule set (563 rules, 35 `@angular-eslint`) to the flag.
 *
 * Autofixable problems are fixed silently. Anything left is written to stderr
 * with exit 2, the code Claude Code feeds back to the agent, so violations that
 * `--fix` cannot repair — `no-explicit-any`, `require-await`, module boundaries —
 * get corrected in the turn that introduced them instead of at commit time.
 * This does not replace `.husky/pre-commit`: the hook sees one file and can be
 * skipped by editing outside Claude Code, so `nx run-many -t lint` remains the
 * gate. It shortens the feedback loop; it does not own enforcement.
 *
 * The `--format json` output is parsed rather than passed through: `FORCE_COLOR`
 * is set in some terminals and defeats `--no-color`, which would otherwise pipe
 * ANSI escapes into the agent's context.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, extname, isAbsolute, join, relative, resolve } from 'node:path';

const LINTABLE = new Set(['.ts', '.mts', '.cts', '.tsx', '.js', '.mjs', '.cjs', '.jsx', '.html']);

/** Nearest ancestor directory holding an `eslint.config.mjs`, bounded by `root`. */
function nearestConfigDir(filePath, root) {
    for (let dir = dirname(filePath); dir.startsWith(root) && dir !== root; dir = dirname(dir)) {
        if (existsSync(join(dir, 'eslint.config.mjs'))) {
            return dir;
        }
    }
    return root;
}

/** `results` entries carry `messages`; a fatal parse error has `ruleId: null`. */
function formatMessages(results, root) {
    const lines = [];
    for (const result of results) {
        for (const message of result.messages) {
            const where = `${relative(root, result.filePath)}:${String(message.line)}:${String(message.column)}`;
            const rule = message.ruleId ?? (message.fatal === true ? 'parse error' : 'eslint');
            lines.push(`${where}  ${message.message.split('\n')[0]}  [${rule}]`);
        }
    }
    return lines;
}

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
    let filePath;
    try {
        filePath = JSON.parse(raw).tool_input?.file_path;
    } catch {
        process.exit(0);
    }

    if (!filePath || !LINTABLE.has(extname(filePath))) {
        process.exit(0);
    }

    const root = resolve(process.env['CLAUDE_PROJECT_DIR'] ?? process.cwd());
    const absolute = isAbsolute(filePath) ? filePath : resolve(root, filePath);

    const eslint = spawnSync(
        process.execPath,
        [join(root, 'node_modules/eslint/bin/eslint.js'), '--fix', '--no-warn-ignored', '--format', 'json', absolute],
        { cwd: nearestConfigDir(absolute, root), encoding: 'utf8' }
    );

    // Exit 0 means clean or fully fixed. Exit 2 is ESLint's own "could not run"
    // — a missing config or a bad flag — which is a hook bug, not a code problem,
    // so it must not be reported as a lint failure against the edited file.
    if (eslint.status === 0 || eslint.status === null || eslint.status === 2) {
        process.exit(0);
    }

    let results;
    try {
        results = JSON.parse(eslint.stdout);
    } catch {
        process.exit(0);
    }

    const lines = formatMessages(results, root);
    if (lines.length === 0) {
        process.exit(0);
    }

    process.stderr.write(`eslint could not autofix the following in the file just written:\n${lines.join('\n')}\n`);
    process.exit(2);
});
