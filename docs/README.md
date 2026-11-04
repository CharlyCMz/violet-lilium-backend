# Violet Lilium Backend — Knowledge Base

> Purpose: this folder is the **authoritative orientation document** for this repository. Read it
> (or the relevant section of it) before working on the codebase, instead of re-scanning the repo
> from scratch. Every claim here was verified against source on 2026-01-25.
>
> If anything here disagrees with the code, **the code wins** — update this doc.

## System at a glance

| Aspect | Value |
|---|---|
| What it is | REST API backend for "Violet Lilium", an e-commerce application (adult-products shop) |
| Architecture | Modular monolith (NestJS feature modules), layered Controller → Service → Repository |
| Framework | NestJS 11 on Express, TypeScript 5.7 (CommonJS, ES2021) |
| Persistence | PostgreSQL 15 via TypeORM 0.3 (schema via versioned migrations; baseline `BaseSchema1793650044833`) |
| Validation | class-validator + global `ValidationPipe` (whitelist, forbidNonWhitelisted, auto-transform) |
| API docs | Swagger UI at `/docs` |
| Config | Single YAML file (`config.yml`, repo root), loaded via `@nestjs/config` custom loader |
| Auth | **Implemented (Phase 2, 2026-11-03).** JWT login `POST /auth` → `{accessToken, user}`; global guard chain (`@Public()` seam + `@Roles('Admin')` RBAC); catalog GETs public, writes admin-only |
| Tests | Jest 30 (ts-jest); e2e with supertest. Effectively only boilerplate tests exist |
| Frontend consumer | Angular SPA (`localhost:4200` dev; `violetlilium.com` prod) via CORS allowlist |
| Environments | Local dev: Docker Postgres on the dev machine. Production: DigitalOcean droplet with domain |

## Navigation — what to read for what

| You want to… | Read |
|---|---|
| Get oriented fast | This file (you're doing it) |
| Understand the business & stack | [01-system-overview.md](01-system-overview.md) |
| Understand structure, modules, request flow, config | [02-architecture.md](02-architecture.md) |
| Touch the database / entities / relations | [03-domain-model.md](03-domain-model.md) |
| Build or debug an endpoint, integrate the frontend | [04-api-surface.md](04-api-surface.md) |
| Write new code that matches the codebase conventions | [05-design-patterns.md](05-design-patterns.md) |
| Know the landmines before changing something | [06-gaps-risks-tech-debt.md](06-gaps-risks-tech-debt.md) |
| Apply the production migration baseline / run migrations on prod | [07-runbook-baseline-prod.md](07-runbook-baseline-prod.md) |

## Mental model in 60 seconds

- One NestJS app: root `AppModule`, global `DatabaseModule`, `ProductsModule` (the whole
  catalog — 7 entities/services/controllers), `SalesModule` (stock decrement), `UsersModule`
  (users, roles, persons, doc types, addresses, locations — the auth foundation),
  `UtilsModule` (CSV processor for bulk upload, pipes), and the still-empty `AuthModule`
  placeholder.
- Everything is CRUD over 13 TypeORM entities, all UUID-keyed, all **soft-deletable**
  (`deleted_at` via `@DeleteDateColumn`). Hard delete is a separate, deliberately-named
  `eliminate` operation.
- Multi-entity writes run inside `dataSource.transaction(...)`. Counters (`views`,
  `total_sales`, `stock`) are updated with raw SQL arithmetic to stay race-safe; checkout
  additionally takes a **pessimistic write lock**.
- Public catalog reads default to `ProductStatus.Published` and come with home-page
  shortcuts: `discount`, `top-sales`, `most-popular`, `new-arrivals`, `related`.
- Auth: JWT (5d) via `POST /auth`; a global guard chain protects everything except `@Public`
  storefront GETs, and `@Roles('Admin')` restricts writes + admin controllers. Schema evolution
  is explicit: versioned TypeORM migrations (`synchronize: false`;
  production baseline procedure in the runbook).

## Status snapshot

Branch `Dev`. Feature set: catalog CRUD + product guides + manual sales + users domain
(users, roles, persons, doc-types, addresses, locations with CSV bulk upload and boot seed).
Migrations: baseline `BaseSchema1793650044833` (applied on dev and prod — 2026-03-10) plus
`AddUsersSchema1793696002067` (applied on dev — 2026-11-03).
Actively scaffolded areas with commented-out code signal the next phase: authentication
(`CustomAuthGuard`, `@Public()` decorator references in comments) and an abandoned
`InlineProduct`/labels design (comments in entities/DTOs).
