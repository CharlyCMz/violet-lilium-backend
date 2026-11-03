# AGENTS.md

Project knowledge base lives in [`docs/`](docs/README.md). Read it before working here —
especially:

- [`docs/README.md`](docs/README.md) — system at a glance + navigation
- [`docs/06-gaps-risks-tech-debt.md`](docs/06-gaps-risks-tech-debt.md) — known bugs and risks

Quick facts: NestJS 11 + TypeORM + PostgreSQL 15 modular monolith. Catalog CRUD with soft
delete (`deleteEntity` vs `eliminateEntity` for hard delete). Multi-entity writes go through
`dataSource.transaction`. Schema evolves via versioned migrations (`synchronize: false`;
`npm run migration:generate/run/revert/show`). **Auth is not implemented yet** — all endpoints
are public. The users domain already exists (`src/users/`: User, Role, Person, DocType,
Address, Location + boot seed of roles/doc-types) as the foundation for JWT auth (deps
installed; Phase 2). Incoming strings are globally trimmed (`TrimStringsPipe`); `person.mail`
is lowercased and validated with `@IsEmail`. Bulk city catalog upload:
`POST /locations/massive-upload` (CSV, comma or semicolon). Config comes from `config.yml`
(gitignored).

The docs were generated from a full source scan on 2026-01-25; if code and docs disagree,
trust the code and update the docs.
