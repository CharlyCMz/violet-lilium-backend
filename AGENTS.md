# AGENTS.md

Project knowledge base lives in [`docs/`](docs/README.md). Read it before working here —
especially:

- [`docs/README.md`](docs/README.md) — system at a glance + navigation
- [`docs/06-gaps-risks-tech-debt.md`](docs/06-gaps-risks-tech-debt.md) — known bugs and risks

Quick facts: NestJS 11 + TypeORM + PostgreSQL 15 modular monolith. Catalog CRUD with soft
delete (`deleteEntity` vs `eliminateEntity` for hard delete). Multi-entity writes go through
`dataSource.transaction`. **Auth is not implemented** — all endpoints are public. Schema is
auto-synced (`synchronize: true`), no migrations. Config comes from `config.yml` (gitignored).

The docs were generated from a full source scan on 2026-01-25; if code and docs disagree,
trust the code and update the docs.
