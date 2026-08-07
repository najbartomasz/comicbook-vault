---
description: 'Commit message rules for comicbook-vault (Conventional Commits + git line limits).'
---

# Commit Message Generation Instructions

Rationale: [ADR-0001](../../docs/adr/0001-conventional-commits.md). `.husky/commit-msg` runs commitlint, so a message that breaks any rule below is rejected outright.

## The Four Rules That Fail Commits

1. **Summary: six words maximum**, or five when the scope names a project. The 50-character limit counts `type(scope): ` too, and `feat(gui-server): ` alone eats 18 of it. Counting words is reliable; counting characters while writing is not.
2. **Header: no capital letters anywhere**, including product names and acronyms — `eslint`, `nestjs`, `typescript`, `api`. Correct spelling belongs in the body, where case is unconstrained.
3. **Body: break the line every 10 to 12 words.** The 72-character limit applies to every physical line, so the body must contain literal line breaks. Commitlint measures raw text and never rewraps.
4. **Footer: omit it** unless there is a real issue number or breaking change. Never write `No issue references`, `No breaking changes`, or `Refs: none`; commitlint rejects them. Most commits simply end after the body.

## Shape

```text
<type>(<scope>): <summary>

<body: why the change was needed>
```

Add a footer only when it carries real information:

```text
<type>(<scope>)!: <summary>

<body: why the change was needed>

BREAKING CHANGE: <description>
Refs: #123
```

One blank line between parts. Summary and body are mandatory; scope and footer are optional.

## Summary

- Imperative mood: `add`, not `added` or `adds`.
- One action only. Never join facets with "and" — that is the usual reason a header overruns.
- No trailing period, no issue IDs.
- Drop the scope when the summary needs the room; it buys back up to 12 characters.

## Body

- Explain **why**: the problem that prompted the change and what it cost. Never narrate the diff.
- **Descriptive, not imperative.** Begin every sentence with a subject — a person, system, or condition — never a bare verb. Write "Generated headers kept overrunning the limit", not "Remove the placeholder line".
- Generic reasons do not count. "To improve consistency" or "for clarity" fits any commit of the same type; name the actual failure.
- Prose only. No bullet lists, numbered lists, or per-file summaries.

## Type

| Type       | Use for                                              |
| ---------- | ---------------------------------------------------- |
| `feat`     | New user-facing capability                           |
| `fix`      | Correcting broken behavior                           |
| `docs`     | Markdown, ADRs, comments only                        |
| `refactor` | Behavior-preserving code change                      |
| `test`     | Tests and test fixtures only                         |
| `build`    | Dependencies, `package.json`, bundler, build config  |
| `ci`       | Workflow and pipeline files                          |
| `chore`    | Anything else (tooling, editor config, housekeeping) |

If a change spans several types, split the commit; otherwise pick the dominant one.

## Scope

Use `gui-client`, `gui-server`, or `repo` for workspace-wide changes. Omit the scope rather than inventing a new one.

## Footer

Include only real, known information. Never invent issue numbers, never reference ADRs or file paths, and never add co-author or AI attribution trailers — this is a single-maintainer project. A breaking change needs `!` after the type/scope and an uppercase `BREAKING CHANGE:` line. Issue references are `Refs: #123` or `Closes: #123`.

## Examples

The usual shape, ending after the body:

```text
chore(repo): initialize workspace scaffolding

Contributors were seeing different tooling behavior depending on
the machine and OS they worked from, and mismatched editor
settings produced noisy whitespace diffs on every review.
```

A footer only because there is a real break and a real issue:

```text
refactor(gui-server)!: drop legacy token parser

Two auth paths were validating tokens differently, so a token the
legacy parser accepted could still be rejected by the current one.

BREAKING CHANGE: remove support for legacy auth tokens
Refs: #123
```

## Rejected

- `feat(repo): add commitlint rule to remove placeholder footers` — seven words, 60 characters. Use `feat(repo): reject placeholder footers`.
- `feat(repo): implement ESLint auto-fix hook and update configurations` — over length, joins two facets with "and", and `ESLint` carries capitals. Use `feat(repo): add eslint auto-fix hook`.
- `fix: stuff.` — vague, trailing period, no body.
- A body ending `No issue references.` — states an absence. Delete the line and end after the body.
- A body reading `Omit placeholder lines when there are no references.` — imperative, and it repeats the rule the commit added instead of the reason for it.
- A body that is a bullet list of changed files — use prose explaining why.

## Verify

Check the draft mechanically rather than trusting a visual count:

```bash
npx commitlint --config commitlint.config.js <<'EOF'
<the full draft message>
EOF
```

Silence means it passes. `.husky/commit-msg` runs the same check at commit time.
