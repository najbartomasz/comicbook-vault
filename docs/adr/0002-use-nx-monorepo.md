# ADR-0002: Use Nx Monorepo

**Date**: 2026-08-03
**Status**: Accepted

## Context

As the project scales using Domain-Driven Design (DDD), maintaining strict architectural boundaries across different modules becomes increasingly difficult. Historically, architectural guidelines degrade into erodable conventions because they rely entirely on developer discipline and manual code reviews. Furthermore, managing multiple repositories (a polyrepo setup) as a solo developer introduces severe overhead. Context switching, maintaining disparate CI/CD pipelines, and dealing with version bumps across shared libraries consume valuable time that should be spent on feature development. A systemic, automated way to ensure separation of concerns is needed while minimizing DevOps and repository management overhead.

## Decision

I will use an Nx monorepo to structure, manage, and build the project ecosystem.

### Architectural Boundary Enforcement

**The `@nx/enforce-module-boundaries` linting rule will mechanize domain layering.**

- Project tags will define boundaries and allowable dependency graphs.
- Architectural rules (e.g., "password hashes never reach the GUI") will be encoded directly in the linter configuration.
- Code imports violating these defined boundaries will literally fail the build.

This ensures DDD layering acts as a strict, automated rule rather than a heavily monitored convention.

### Atomic Cross-Stack Changes

**Backend and frontend applications will co-exist to allow simultaneous updates.**

- Shared API interfaces and their implementations can be updated in a single commit.
- The TypeScript compiler will instantly flag breaking changes across the entire stack.
- Cross-repository version bumps and synchronization are eliminated.

This prevents the friction of coordinating releases across decoupled repositories.

### Unified Tooling Management

**A single, global set of developer tools will govern the entire workspace.**

- One `package.json` will manage all third-party dependencies.
- Linting, formatting, and compilation configurations will be centralized.
- Upgrades to frameworks or core libraries will be executed once for all projects.

This drastically reduces the DevOps and maintenance overhead required for a solo developer.

### Frictionless Code Sharing

**Shared utilities and UI components will be extracted into internal Nx libraries.**

- Common code can be instantly imported into any workspace application.
- The overhead of npm publishing or `npm link` setups is completely bypassed.
- Standard import syntax is maintained while still respecting architectural boundaries.

This encourages high modularity and reuse without a polyrepo package management tax.

## Consequences

### Positive

- Prevents structural erosion by making architectural boundaries a lint-enforced rule rather than a manual convention.
- Eliminates ambiguity when reviewing code regarding valid and invalid cross-module imports.
- Enables atomic cross-stack changes without tedious version bumps.
- Unifies tooling and dependency management, reducing configuration drift.
- Provides frictionless code sharing without the need for npm publishing.

### Negative

- Introduces the overhead of learning and maintaining Nx workspace configurations.
- Requires upfront architectural design to properly establish project tags and strict boundary rules before development can scale.

### Neutral

- The specific tagging taxonomy and the exact matrix of permitted module boundaries must be documented and updated as the domain model evolves.
