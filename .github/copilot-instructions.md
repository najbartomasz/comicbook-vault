# Copilot Instructions

**Read [`AGENTS.md`](../AGENTS.md) in the repository root. It is the single source of truth for this repository, and everything below is subordinate to it.**

This file exists only as a pointer. Copilot does not expand imports, so the rules are deliberately not duplicated here: two copies would drift, and a stale copy reads as authoritative. VS Code combines every instruction file it finds rather than picking one, so duplicating `AGENTS.md` here would also send the same rules to the model twice.

Modern Copilot surfaces read `AGENTS.md` natively. This file is kept for surfaces that look only for `.github/copilot-instructions.md`.

If you cannot read `AGENTS.md`, the three rules most likely to cause a broken commit are:

- Lint is type-aware at `strictTypeChecked` — no `any`, no floating promises, `??` over `||`, and `async` without `await` is an error.
- Verify with `npx nx run-many -t lint` before finishing. `.husky/pre-commit` runs it and rejects the commit on failure.
