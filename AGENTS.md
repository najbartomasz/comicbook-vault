# Agent Instructions

Instructions for AI coding agents working in `comicbook-vault`. This is the single source of truth; do not duplicate these rules elsewhere.

Copilot and Cursor read this file natively. Claude Code reads only `CLAUDE.md`, so the root `CLAUDE.md` is a one-line `@AGENTS.md` import — add Claude-specific instructions below that import rather than here. `.github/copilot-instructions.md` is a pointer for surfaces that look only for that path.

## Workspace Shape

An Nx monorepo with two applications and no libraries yet.

| Project      | Path              | Stack                            | Test runner |
| ------------ | ----------------- | -------------------------------- | ----------- |
| `gui-client` | `apps/gui/client` | Angular 22, standalone, `OnPush` | Vitest      |
| `gui-server` | `apps/gui/server` | NestJS 11                        | Jest        |

`gui-server` serves the `gui-client` bundle and owns the API under the `api` prefix. The two are coupled through build configuration only, with no source imports between them. See [ADR-0003](docs/adr/0003-serve-gui-client-from-nestjs-bff.md).

## Verification

Run this before claiming any change is complete:

```
npx nx run-many -t lint
```

Lint is type-aware, so it needs a valid type graph and will report genuine type errors as lint failures. Also relevant:

```
npx nx run-many -t test
npx nx run-many -t build
npx prettier --check .
```

`.husky/pre-commit` runs Prettier over staged files and then `nx run-many -t lint`. A commit that breaks lint is rejected.

## Typing Rules

The workspace lints at `strictTypeChecked` + `stylisticTypeChecked`. These are not stylistic preferences; they fail the build.

- **No `any`.** `@typescript-eslint/no-explicit-any` is an error. Use `unknown` and narrow.
- **No non-null assertions** (`!`) in source. Permitted in `*.spec.ts` only, for fixture values known to be present.
- **Catch callbacks take `unknown`**: `.catch((err: unknown) => { ... })`. The braces matter — an arrow shorthand returning a `void` call trips `no-confusing-void-expression`.
- **Use `??`, not `||`**, for defaulting.
- **Template literals interpolate strings only.** `allowNumber` is off, so convert to `string` before interpolating rather than relying on coercion.
- **Never leave a promise floating.** `await` it, or `.catch()` it, or explicitly `void` it.
- **`async` requires an `await`.** `require-await` is deliberately on. A NestJS method declared `async` purely for interface conformance will fail lint: drop the `async`, add a real `await`, or write a justified `eslint-disable` comment. This is configured behavior, not a misconfiguration.
- **Index signatures need bracket access**: `process.env['PORT']`, not `process.env.PORT`.
- **Indexed access yields `T | undefined`.** `noUncheckedIndexedAccess` is on, so narrow before use.
- **Optional properties are exact.** `exactOptionalPropertyTypes` is on, so `{ a?: string }` does not accept `{ a: undefined }`.

`eslint-disable` comments must be justified in a comment and must be necessary — `reportUnusedDisableDirectives` is an error, so a stale disable fails the build.

## Project-Specific Rules

- **Server code has no DOM.** `tsconfig.base.json` sets `lib: ["es2022"]` and only the client adds `dom`. Referencing `document`, `window`, or `Window` in `gui-server` fails to compile. This is intentional: the BFF runs on Node.
- **Angular templates are linted for accessibility.** 11 `templateAccessibility` rules are active. Interactive elements need keyboard handlers and focusability; images need text alternatives.
- **Angular components** are standalone with `ChangeDetectionStrategy.OnPush`, use `inject()` over constructor injection, and use `app` selector prefixes.
- **Server specs are linted by `eslint-plugin-jest`.** A committed `describe.only` or `fit` fails lint. Client specs are Vitest and have no equivalent check, so do not leave focused tests there either.
- **`*.module.ts`** is exempt from `no-extraneous-class`. No other file is.
- **Cross-project imports are constrained.** `type:app` may only depend on `type:lib`, so `gui-client` and `gui-server` cannot import from each other. Shared code belongs in a new library.

## Formatting

Prettier owns all formatting; never hand-format or add formatting rules to ESLint. Config is `.prettierrc`: 4 spaces, single quotes, semicolons, no trailing commas, 140-column width, LF endings.

`docs/` and `.github/instructions/` are Prettier-ignored hand-authored prose (`.prettierignore`). Do not reflow them.

## Commits

Conventional Commits, per [ADR-0001](docs/adr/0001-conventional-commits.md). The full rules — types, scopes, 50-character summary, mandatory prose body wrapped at 72 characters — are in [`.github/instructions/commit-message.instructions.md`](.github/instructions/commit-message.instructions.md). Read that file before writing a commit message.

Two rules agents get wrong most often: the body must explain _why_ in prose with no bullet lists, and **no co-author or AI attribution trailers** — this is a single-maintainer project.

## Documentation

Architectural decisions go in `docs/adr/` using `docs/adr/TEMPLATE.md`. Add an ADR when a decision constrains future work; do not add one for routine changes.
