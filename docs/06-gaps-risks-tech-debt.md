# 06 — Gaps, Risks & Tech Debt

Verified findings from the full scan (2026-01-25), ordered roughly by blast radius. Each entry
says what it is, where it lives, and why it matters. Treat this as the pre-flight checklist
before touching the related area. Last updated 2026-11-13.

## Resolved

**2026-11-13 — friendly conflicts + nested validation (branch `Dev`):**
- **Unique violations → 409.** Global `TypeormExceptionFilter` (`APP_FILTER` in
  `src/app.module.ts`, lives in `src/utils/filters/`) maps Postgres `23505` to a 409 with a
  parsed message (`The value (jcardonac) for (username) already exists`, works for composite
  keys too — locations, persons). Other `QueryFailedError`s get a sanitized 500 (no SQL leak).
  Applies to every write endpoint (users, roles, persons, categories, sub-categories,
  product-variants SKUs, locations), not just `POST /users`.
- **No more orphan persons on failed user creation.** `UserService.createEntity` rolls back
  the created person (addresses first, then hard delete) if the user save fails, and looks up
  the role before creating anything — previously a duplicate username left a committed
  person/address behind, consuming the unique `mail`/`phone`.
- **Nested DTO validation closed (products/sales).** `@ValidateNested()` + `@Type()` on
  `CreateProductDTO.productVariants[]` and `CreateProductVariantDTO.images[]`;
  `PUT /sales/manual-sell` validates each array item via `ParseArrayPipe` (array body contract
  unchanged). Verified 400s with per-item paths (`productVariants.0.sku should not be empty`).
- **`person.document` length guard.** Column is `varchar(10)`; `@MaxLength(10)` on the DTO now
  turns the `22001 value too long` 500 into a clear 400. If real-world documents need more
  than 10 chars, widen the column via migration and relax the decorator (see #13 below).

**2026-11-03 — authentication & authorization (branch `Dev`, Phase 2):**
- **JWT auth**: `POST /auth` (local strategy + bcrypt; uniform 401 for unknown user or wrong
  password — no user-existence leak; returns `{accessToken, user}`). JWT HS256, 5d expiry from
  `violetLilium.jwtExpiresIn`, payload `{sub, username, role}`.
- **Global guard chain** (`APP_GUARD`, order matters): `CustomAuthGuard` skips `@Public()`
  routes, else validates the bearer token AND that `sub` still exists in `users`;
  `RolesGuard` enforces `@Roles(...)` against the token role claim (403). Storefront GETs are
  `@Public`; all writes + admin controllers require `@Roles('Admin')`. Verified on dev with a
  20-case matrix: 401 (no/bad/ghost token, bad credentials), 403 (role mismatch), 200/201
  (public reads, admin writes), cleanup. The role is read from the signed token, not from the
  DB user, so a Customer-claim token cannot escalate even if the underlying user is Admin.

**2026-11-03 — users domain + request hardening (branch `Dev`):**
- **Users module added** (`src/users/`): `User`, `Role`, `Person`, `DocType`, `Address`,
  `Location` entities; migration `AddUsersSchema1793696002067` (6 tables; unique constraints
  on `users.username`, `persons.mail`, `persons.phone`, `roles.name`, and a composite unique
  index on `locations(country_code, state_code, city_code)`). Idempotent boot seed creates
  roles `Admin`/`Customer` and doc types CC/CE/NIT/PPT/TI; bootstrap admin is created manually.
  Verified end-to-end on dev: user creation with bcrypt-hashed password, whole-graph
  persistence, CSV catalog upload with per-row duplicate rejection.
- **Locations bulk upload**: `POST /locations/massive-upload` accepts `.csv` (validated by
  extension or `text/csv` — Windows registers `.csv` as `application/vnd.ms-excel`),
  auto-detects `,`/`;` delimiter, uppercases `countryCode`; parse failures return 400 instead
  of an unhandled 500.
- **Input normalization**: global `TrimStringsPipe` trims every incoming string; `person.mail`
  is lower-cased and must satisfy `@IsEmail`. **Nested-validation gap fixed in the users
  chain** (`@ValidateNested()` + `@Type()` on user→person→address — nested payloads were
  previously transformed but never validated).

**2026-02-11 — migrations enabled:**
- **`synchronize: true` replaced by versioned migrations.** `DatabaseModule` now runs
  `synchronize: false`; baseline migration `BaseSchema1793650044833` (full schema DDL)
  generated under `src/database/migrations/`; CLI datasource at `src/database/data-source.ts`
  with npm scripts `migration:generate/run/revert/show`. Baseline marked-as-applied on dev
  and on prod (2026-03-10, following [`07-runbook-baseline-prod.md`](07-runbook-baseline-prod.md):
  pre-deploy `pg_dump` backup, schema-parity gate, INSERT of the baseline record).

**2026-01-25 — runtime bugs (verified fixed):**

- **Phantom `js-yaml` dependency** → declared as a direct dependency (`js-yaml@^5.5.0` +
  `@types/js-yaml@^4.0.9` in `package.json`). Environments only need `npm i`.
- **`sortBy` validated against the wrong enum** → `@IsEnum(SortBy)` in
  `src/products/dtos/product-variant.dto.ts:117`.
- **`AttributeService.findAll` nonexistent relation** → `productVariants` in
  `src/products/services/attribute.service.ts:16`.
- **Missing `await` in `ImagesService.findOne`** → added in
  `src/products/services/images.service.ts:38`.

## Security

1. **Plaintext secrets in the working tree.** `config.yml` holds DB password, JWT secret, and a
   Mailersend-format mailer token. It is gitignored (not committed), but there's no env-var
   mechanism — the file is the only config source, and prod secrets sit beside dev ones.
2. **No hardening middleware.** No helmet, no rate limiting. CORS is properly allowlisted but
   that's the only defense.

## Bugs & test debt

4. **Stale tests**: both spec files still assert `'Hello World!'` while the service returns
   the Spanish greeting — `npm test` and `test:e2e` fail out of the box. There is effectively
   **zero real test coverage**.

## Dead / orphaned code (don't resurrect blindly)

5. **Unwired service methods**: `ProductService.updateEntity` and `ProductService.softDelete`
   have no controller routes — the product aggregate can only be created/extended/read.
6. **Unused DTOs**: `banner.dto.ts` (no Banner entity/controller), `search-bar.dto.ts`
   (references a nonexistent `Label` entity), `PaginatedProductDTO` (defined, never used),
   `UpdateProductDTO`, `CreateImageDTO.frontImageId` (accepted, ignored), image DTO's
   `productGuideId` (service code has a `//create with productGuide` TODO and ignores it).
7. **Commented-out designs**: `InlineProduct` sales entity/relation in `ProductVariant`
   (`src/products/entities/product-variant.entity.ts:16,72`), `Label` in search DTO,
   a commented `createEntity` in `ProductVariantController`.

## Design inconsistencies

8. **Timestamp type mismatch**: `Product` uses `timestamp`, every other entity `timestamptz`.
9. **Quasi-polymorphic `Image`**: two nullable owning FKs (`productVariant`, `productGuide`)
   plus being the target of `frontImage`. No constraint enforces "exactly one parent".
10. **Side-effecting GET**: `GET /products/:id/variant/:variantId` increments `views`
    (`src/products/services/product.service.ts:32`) — crawlers/refreshes pollute popularity.
11. **Mixed line endings**: `src/sales/*` is CRLF, the rest LF. Also a typo'd filename:
    `attibute.controller.ts`.
12. **No API prefix/versioning** — any future versioning will be a breaking URL change for the
    Angular app.
13. **`persons.document` is `varchar(10)`** — fits Colombian CC/NIT digits, but passports and
    foreign docs can exceed it. The DTO `@MaxLength(10)` currently rejects those with a 400;
    if the business needs longer documents, widen the column via migration and relax the
    decorator together.

## Architect's improvement backlog (prioritized)

| # | Item | Why |
|---|---|---|
| 1 | Implement `AuthModule` (guard + `@Public`) — the seam is already annotated | Everything is public today |
| 2 | Move secrets to env vars; keep `config.yml` for non-secret structure | Config hygiene |
| 3 | Fix the stale specs so the test suite is a usable safety net | Zero real coverage today |
| 4 | Decide the fate of `InlineProduct`/orders vs. manual-sell-only | Dead design is a trap for future edits |
| 5 | Wire or delete `updateEntity`/`softDelete` + product routes | Half-built aggregate API |
| 6 | Real tests around transactions and the sell flow | The money path is untested |
