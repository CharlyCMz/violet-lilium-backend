# 06 — Gaps, Risks & Tech Debt

Verified findings from the full scan (2026-01-25), ordered roughly by blast radius. Each entry
says what it is, where it lives, and why it matters. Treat this as the pre-flight checklist
before touching the related area.

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
4. **`synchronize: true`** (`src/database/database.module.ts:19`) — TypeORM auto-mutates the
   production schema from entity metadata on boot. Data-loss risk under drift; there is **no
   migration setup at all**.

## Bugs (confirmed by reading code)

5. **Missing declared dependency: `js-yaml`.** `src/config.ts` imports it, but `package.json`
   does not declare it. It resolves only because `@nestjs/swagger` pulls it in transitively
   (npm ls confirms: `@nestjs/swagger → js-yaml@4.1.1`). If swagger is ever removed or the
   tree dedupes differently, the app won't boot. Add it to `dependencies`.
6. **`GetProductVariantFiltersDTO.sortBy` validates against the wrong enum**
   (`src/products/dtos/product-variant.dto.ts:117`): `@IsEnum(Sort)` instead of
   `@IsEnum(SortBy)`. With `forbidNonWhitelisted`, any request passing `?sortBy=createdAt`
   gets a **400**. The service defaults (`sortBy = Recent`, `sort = Asc`) mask it until someone
   passes the param.
7. **`AttributeService.findAll` loads a nonexistent relation**
   (`src/products/services/attribute.service.ts:16`): `relations: ['variantsAttributes']` —
   the relation is named `productVariants`. Calling `GET /attributes` throws at runtime.
8. **`ImagesService.findOne` is missing `await`** (`src/products/services/images.service.ts:38`):
   checks the Promise (always truthy), so the NotFound guard never fires and it returns a
   pending Promise. Latent — not currently exposed by a route.
9. **Stale tests**: both spec files still assert `'Hello World!'` while the service returns
   the Spanish greeting — `npm test` and `test:e2e` fail out of the box. There is effectively
   **zero real test coverage**.

## Dead / orphaned code (don't resurrect blindly)

10. **Unwired service methods**: `ProductService.updateEntity` and `ProductService.softDelete`
    have no controller routes — the product aggregate can only be created/extended/read.
11. **Unused DTOs**: `banner.dto.ts` (no Banner entity/controller), `search-bar.dto.ts`
    (references a nonexistent `Label` entity), `PaginatedProductDTO` (defined, never used),
    `UpdateProductDTO`, `CreateImageDTO.frontImageId` (accepted, ignored), image DTO's
    `productGuideId` (service code has a `//create with productGuide` TODO and ignores it).
12. **Commented-out designs**: `InlineProduct` sales entity/relation in `ProductVariant`
    (`src/products/entities/product-variant.entity.ts:16,72`), `Label` in search DTO,
    a commented `createEntity` in `ProductVariantController`.

## Design inconsistencies

13. **Timestamp type mismatch**: `Product` uses `timestamp`, every other entity `timestamptz`.
14. **Quasi-polymorphic `Image`**: two nullable owning FKs (`productVariant`, `productGuide`)
    plus being the target of `frontImage`. No constraint enforces "exactly one parent".
15. **Side-effecting GET**: `GET /products/:id/variant/:variantId` increments `views`
    (`src/products/services/product.service.ts:32`) — crawlers/refreshes pollute popularity.
16. **Mixed line endings**: `src/sales/*` is CRLF, the rest LF. Also a typo'd filename:
    `attibute.controller.ts`.
17. **No API prefix/versioning** — any future versioning will be a breaking URL change for the
    Angular app.

## Architect's improvement backlog (prioritized)

| # | Item | Why |
|---|---|---|
| 1 | Declare `js-yaml`; add a smoke test that boots the app | One-line fix, removes boot fragility |
| 2 | Fix the two runtime bugs (#6, #7) and the missing `await` (#8) | Known 500s on live endpoints |
| 3 | Replace `synchronize` with migrations (TypeORM CLI) | Production safety |
| 4 | Implement `AuthModule` (guard + `@Public`) — the seam is already annotated | Everything is public today |
| 5 | Move secrets to env vars; keep `config.yml` for non-secret structure | Config hygiene |
| 6 | Decide the fate of `InlineProduct`/orders vs. manual-sell-only | Dead design is a trap for future edits |
| 7 | Wire or delete `updateEntity`/`softDelete` + product routes | Half-built aggregate API |
| 8 | Real tests around transactions and the sell flow | The money path is untested |
