# AGENTS.md

Project knowledge base lives in [`docs/`](docs/README.md). Read it before working here —
especially:

- [`docs/README.md`](docs/README.md) — system at a glance + navigation
- [`docs/06-gaps-risks-tech-debt.md`](docs/06-gaps-risks-tech-debt.md) — known bugs and risks

Quick facts: NestJS 11 + TypeORM + PostgreSQL 15 modular monolith. Catalog CRUD with soft
delete (`deleteEntity` vs `eliminateEntity` for hard delete). Multi-entity writes go through
`dataSource.transaction`. Schema evolves via versioned migrations (`synchronize: false`;
`npm run migration:generate/run/revert/show`). **Auth (Phase 2, 2026-11-03)**: JWT login at
`POST /auth` → `{accessToken, user}`; guard chain global vía `APP_GUARD` — `CustomAuthGuard`
(JWT, salta rutas `@Public()`, verifica que el usuario del token siga existiendo) y luego
`RolesGuard` (`@Roles('Admin')`; el rol se lee del claim del token). Los GETs del storefront
son `@Public`; todo lo demás exige token, y los writes + controllers admin exigen rol Admin.
Incoming strings are globally trimmed (`TrimStringsPipe`); `person.mail` is lowercased and
validated with `@IsEmail`. Bulk city catalog upload: `POST /locations/massive-upload` (CSV,
comma or semicolon). Config comes from `config.yml` (gitignored). DB unique violations return
**409** via the global `TypeormExceptionFilter` (`src/utils/filters/`); failed `POST /users`
rolls back the created person (no orphans).

The docs were generated from a full source scan on 2026-01-25; if code and docs disagree,
trust the code and update the docs.
