# 06 — Gaps, Risks & Tech Debt

Verified findings from the full scan (2026-01-25), ordered roughly by blast radius. Each entry
says what it is, where it lives, and why it matters. Treat this as the pre-flight checklist
before touching the related area. Last updated 2026-02-11.

## Resolved

**2026-02-11 — migrations enabled:**
- **`synchronize: true` replaced by versioned migrations.** `DatabaseModule` now runs
  `synchronize: false`; baseline migration `BaseSchema1793650044833` (full schema DDL)
  generated under `src/database/migrations/`; CLI datasource at `src/database/data-source.ts`
  with npm scripts `migration:generate/run/revert/show`. Baseline marked-as-applied on dev;
  production procedure in [`07-runbook-baseline-prod.md`](07-runbook-baseline-prod.md).

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

1. **No authentication/authorization at all.** Every endpoint is public. `AuthModule` is empty;
   controllers carry only commented-out `@UseGuards(CustomAuthGuard)` / `@Public()` references
   to files that don't exist (`src/auth/guards/custom-auth.guard.ts`,
   `src/auth/decorators/public.decorator.ts`). JWT secret already sits unused in `config.yml`.
   → Any write endpoint (including `eliminate` hard deletes and manual sells) is exposed.
2. **Plaintext secrets in the working tree.** `config.yml` holds DB password, JWT secret, and a
   Mailersend-format mailer token. It is gitignored (not committed), but there's no env-var
   mechanism — the file is the only config source, and prod secrets sit beside dev ones.
3. **No hardening middleware.** No helmet, no rate limiting. CORS is properly allowlisted but
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

## Architect's improvement backlog (prioritized)

| # | Item | Why |
|---|---|---|
| 1 | Implement `AuthModule` (guard + `@Public`) — the seam is already annotated | Everything is public today |
| 2 | Move secrets to env vars; keep `config.yml` for non-secret structure | Config hygiene |
| 3 | Fix the stale specs so the test suite is a usable safety net | Zero real coverage today |
| 4 | Decide the fate of `InlineProduct`/orders vs. manual-sell-only | Dead design is a trap for future edits |
| 5 | Wire or delete `updateEntity`/`softDelete` + product routes | Half-built aggregate API |
| 6 | Real tests around transactions and the sell flow | The money path is untested |
