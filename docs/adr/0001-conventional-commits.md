# ADR-0001: Conventional Commits

**Date**: 2026-07-30
**Status**: Accepted

## Context

Inconsistent commit messages across the codebase make it difficult to parse project history, trace the context of changes, and automate release processes. Without a standardized format, overly long summary lines are often written that get truncated in Git tooling and GitHub's UI, or the reasoning behind a change is omitted entirely. We need a standardized approach to structure commit messages and restrict line lengths so that version control history remains readable, searchable, and machine-parsable.

## Decision

I will adopt the [Conventional Commits](https://www.conventionalcommits.org/) standard combined with standard Git formatting conventions for all repository commit messages.

### Commit Structure
**Every commit message must follow a strict, multi-part format to clearly communicate intent.**
- Commits must start with a type: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`, or `build`.
- An optional scope may follow the type in parentheses (e.g., `feat(api):`).
- The summary line must be written in the imperative mood, use lowercase, and omit any trailing period.
- A blank line is required before the body, which must explain the *why* behind the change rather than restating the diff. The body is written as prose; bullet lists and per-file change summaries are not used, because they restate the diff that `git show` already provides.
- An optional footer, separated by a blank line, is reserved for `BREAKING CHANGE:` declarations or issue references. Co-author trailers are not used, since this is a single-maintainer project.
Adhering to this structure enables automated changelog generation and semantic versioning.

### Length Constraints
**Message lines must adhere to strict character limits to ensure readability across terminal environments and web UIs.**
- Summary line: 50-character maximum, including type and scope (leaves room for `git log --oneline`'s 7-8 char hash prefix on an 80-col terminal and stays clear of truncation in GitHub's UI).
- Body lines: 72-character maximum (`git log` indents body text 4 spaces by default; 72 + 4 = 76, keeping it under the classic 80-col terminal width).
Enforcing these limits ensures our git history is visually clean and accessible regardless of the tooling used.

## Consequences

### Positive
- Enables the use of automated semantic versioning and changelog generation tools.
- Improves readability of `git log --oneline` and GitHub commit lists due to strict length limits.
- Ensures the "why" behind changes is clearly communicated by providing a dedicated, structured body.
- Enforced automatically via commitlint and Husky, eliminating reliance on manual discipline.

### Negative
- Introduces a slight learning curve to adopt and internalize the Conventional Commits specification.
- Requires mental overhead to manually wrap body lines at 72 characters when committing from the CLI.
- The 50-character summary maximum occasionally forces rewording, since the type and scope consume part of the budget.
