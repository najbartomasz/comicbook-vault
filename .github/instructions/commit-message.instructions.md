---
description: 'Commit message rules for comicbook-vault (Conventional Commits + git line limits).'
---

# Commit Message Generation Instructions

Apply these rules to every commit in this repository. Rationale: [ADR-0001](../../docs/adr/0001-conventional-commits.md).

## Required Structure

```text
<type>(<scope>): <summary>

<body: why the change was made>

<footer>
```

- Summary and body are mandatory. Scope and footer are optional.
- Exactly one blank line between summary, body, and footer.

## Type

| Type | Use for |
| --- | --- |
| `feat` | New user-facing capability |
| `fix` | Correcting broken behavior |
| `docs` | Markdown, ADRs, comments only |
| `refactor` | Behavior-preserving code change |
| `test` | Tests and test fixtures only |
| `build` | Dependencies, `package.json`, bundler, build config |
| `ci` | Workflow and pipeline files |
| `chore` | Anything else (tooling, editor config, housekeeping) |

If a change spans several types, prefer splitting the commit. Otherwise pick the type of the dominant change.

## Scope

- Use the name of the affected project or package (for example `feat(api):`).
- Use `repo` for root-level or workspace-wide changes.
- Omit the scope rather than inventing a new one.

## Summary

- Imperative mood: `add`, not `added` or `adds`.
- Lowercase, no trailing period.
- Maximum 50 characters, including the type and scope.
- Keep issue or ticket IDs out of the summary; they belong in the footer.

## Body

- Explain why: context, intent, impact. Never just restate the diff.
- Write prose only. Never use bullet lists, dashes, numbered lists, or per-file change summaries.
- Wrap every line at 72 characters.
- Use a blank line between paragraphs when more than one is needed.

## Footer

- Omit the footer section entirely when there is nothing real to include. Never add placeholder lines such as "No issue references" or "No breaking changes".
- Include only when the information is real and known.
- Breaking change: add `!` after the type/scope **and** a `BREAKING CHANGE: <description>` line. The prefix must be uppercase.
- Issue references: `Refs: #123` or `Closes: #123`. The value must be a GitHub issue number in `#123` form.
- Never reference ADRs, documents, or file paths in the footer.
- Never invent issue numbers or ticket IDs.
- Never add co-author trailers or AI/tool attribution. This is a single-maintainer project.

## Good Examples

```text
docs: add architecture decision log template

Create a reusable ADR template so new decisions are captured with
consistent context, decision, and consequence sections. This keeps
records easy to scan and reduces ambiguity in future discussions.
```

```text
chore(repo): initialize workspace scaffolding

Set up the base project structure so contributors get identical
tooling behavior regardless of their local machine or OS. Shared
editor and line-ending settings prevent noisy whitespace diffs
between environments.
```

```text
feat(api): add issue search filter by status

Support filtering by status to reduce manual triage in the
dashboard and make issue review faster for maintainers.

Refs: #123
```

```text
refactor(auth)!: remove legacy token parser

Drop the legacy parser to reduce duplicate auth paths and prevent
inconsistent validation behavior between old and new token formats.

BREAKING CHANGE: remove support for legacy auth tokens
```

## Bad Examples

```text
Added new API endpoints
```

No type and not lowercase imperative. Fix: `feat(api): add issue search endpoints`, plus a body explaining why.

```text
fix: stuff.
```

Vague summary, trailing period, no body. Fix: name the broken behavior and explain the impact of the fix.

```text
feat: add a summary line that runs well past fifty characters
```

Summary exceeds the 50-char maximum. Fix: shorten the summary and move the detail into the body.

```text
refactor(ui): move button component

Moved button.tsx to components/common and updated imports.
```

Body restates the diff. Fix: explain why the move was needed, such as sharing the component across features.

```text
docs: add commit message guidelines

Establish a standardized format for commit messages.

- Added commit message instructions in .github/instructions
- Created ADR-0001 to document the decision
```

Body uses a bullet list of changed files. Fix: drop the list and explain in prose why the standard was introduced.

```text
feat(api): rename issue endpoint

Simplify route naming.

breaking change: renamed /v1/issues to /v2/issues
```

Missing the `!` marker and the footer prefix is lowercase. Fix: `feat(api)!:` with `BREAKING CHANGE: rename /v1/issues to /v2/issues`.
