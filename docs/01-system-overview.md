# 01 — System Overview

## Business context

Backend for **Violet Lilium Sexshop**, an e-commerce application. The API serves a product
catalog (categories → sub-categories → products → sellable variants with attributes and
images), editorial "product guides", and a **manual point-of-sale** flow (staff registers a
sale; stock and sales counters are decremented/incremented transactionally).

User-facing messages are in Spanish ("Bienvenido a la API de Violet Lilium Sexshop") — the
operator/team language is Spanish.

## Technology stack

| Layer | Choice | Notes |
|---|---|---|
| Language | TypeScript 5.7, target ES2021, CommonJS | `strictNullChecks: true`, **`noImplicitAny: false`** (relaxed typing) |
| Runtime | Node.js (NestJS 11, Express platform) | Entry: `src/main.ts` |
| ORM | TypeORM 0.3 (`@nestjs/typeorm` 11) | Repository + QueryBuilder patterns |
| Database | PostgreSQL 15 (`pg` 8.16) | Dockerized locally; `synchronize: true` |
| Validation | class-validator 0.14 + class-transformer | Global pipe, strict whitelist |
| OpenAPI | `@nestjs/swagger` 11 + swagger-ui-express | UI mounted at `/docs` |
| Config | `@nestjs/config` 4 + custom YAML loader | `config.yml` at repo root |
| Tests | Jest 30 + ts-jest, supertest | Unit spec + e2e spec, both boilerplate-only |
| Lint/format | ESLint 9 (typescript-eslint type-checked) + Prettier | `no-explicit-any: off` |
| Infra | docker-compose (single `postgres:15` service) | Local dev DB, data volume `./postgres_data` |

## Repository layout

```
├── src/
│   ├── main.ts                  # bootstrap: pipes, CORS, interceptor, Swagger, listen
│   ├── app.module.ts            # root module (imports all feature modules)
│   ├── app.controller.ts/.service.ts  # health/root greeting
│   ├── config.ts                # YAML config loader + AppConfig type
│   ├── auth/                    # AuthModule — EMPTY placeholder
│   ├── database/                # DatabaseModule — @Global TypeORM root
│   ├── products/                # the catalog domain
│   │   ├── controllers/         # 7 controllers
│   │   ├── services/            # 7 services
│   │   ├── entities/            # 7 TypeORM entities
│   │   └── dtos/                # 10 DTO files
│   ├── sales/                   # SalesModule — manual sell endpoint
│   └── utils/                   # UtilsModule — EMPTY placeholder
├── test/                        # e2e spec (stale, see risks doc)
├── config.yml                   # runtime config (gitignored)
├── docker-compose.yml           # local Postgres 15 (gitignored)
├── dist/                        # build output (gitignored)
└── postgres_data/               # DB volume (gitignored)
```

`config.yml`, `docker-compose.yml`, `dist/`, `postgres_data/` are **gitignored** and untracked;
only source, manifests and lockfile are in git.

## Runtime topology

```
Angular SPA (4200 / violetlilium.com)
        │  HTTP (CORS allowlist)
        ▼
   NestJS API (:3000)
   ├─ global ValidationPipe (whitelist + transform)
   ├─ ClassSerializerInterceptor (registered; currently a no-op)
   ├─ Swagger at /docs
   │
   ├─ ProductsModule  ──► products DB schema (7 tables + 2 join tables)
   ├─ SalesModule     ──► product_variants (stock/total_sales)
   └─ DatabaseModule (global, TypeORM) ──► PostgreSQL 15
              (docker-compose locally; prod host in config.yml)
```

## Standard commands

| Command | Effect |
|---|---|
| `npm install` | Install deps |
| `docker compose up -d` | Start local Postgres 15 (db `violet_lilium_db`, user `root`) |
| `npm run start:dev` | Watch-mode dev server on port from `config.yml` (default 3000) |
| `npm run start:prod` | Run compiled `dist/main` |
| `npm run build` | `nest build` (deletes `dist` first) |
| `npm run lint` | ESLint with `--fix` |
| `npm run format` | Prettier write |
| `npm run test` / `test:e2e` / `test:cov` | Jest unit / e2e / coverage |

There is **no CI configuration** in the repo (no GitHub Actions / GitLab CI files).

## Configuration model

Single source: `config.yml` at repo root, loaded at bootstrap by `src/config.ts`
(`yaml.load(readFileSync(...))` cast to the `AppConfig` type) and exposed through the global
`ConfigService` under nested keys:

```yaml
violetLilium:
  port: 3000
  frontendUrl: ['http://localhost:4200', 'https://violetlilium.com', ...]  # CORS allowlist
  jwtSecret: '...'        # configured but UNUSED (auth not implemented)
  mailer: { token: '...' } # configured but UNUSED
database:
  username / password / dbName / host / port
```

- No `.env` support, no env-var interpolation — switching environments means editing
  `config.yml` (a commented-out "Production" block at the bottom is swapped in manually).
- Secrets (DB password, JWT secret, mailer token) live in plaintext in the working tree.
