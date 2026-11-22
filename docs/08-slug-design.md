# 08 — Product Variant Slugs (design contract)

> Status: **design closed, pending frontend sign-off** (branch
> `feature/product-variant-slugs`, opened 2026-11-22). Nothing implemented yet
> when this document was written; update the status as phases land.
> Source: frontend requisition (public product URLs by slug) + Fase-0 decisions
> taken with the tech lead on 2026-11-22.

## Goal

Public storefront URLs are **slug-only** (no `productId`, no `pvId`). Every
product variant resolves uniquely through a single canonical slug, so shared
links, deep links and page refreshes survive without walking the paginated
catalog.

## Decisions (closed)

1. **No `productSlug`.** The storefront never addresses a product alone —
   everything is consumed at variant level (`ProductVariantController`), and
   `Product` is only read as an aggregate of a variant. One canonical slug per
   variant, globally unique. Deviates from the original written requisition
   (which asked for `product_slug + variant_slug` jointly unique): frontend
   confirmed the change.
2. **Slug format** — generated on write, persisted, **frozen afterwards**
   (renaming a variant/brand must not break shared URLs):
   - `variantSlug = slugify(variant name + brand + attribute values in stable order)`
   - Fallback (variant without attributes): `slugify(variant name + brand)`
3. **Collision policy** — write-time collisions get a deterministic suffix
   (`-2`, `-3`, …) so the admin flow never breaks. Safety net: **partial unique
   index** `ON product_variants (variant_slug) WHERE deleted_at IS NULL`
   (partial so soft-deleted rows don't block reuse; full unique would). Any
   violation still maps to 409 via the existing `TypeormExceptionFilter`.
4. **Attribute order** — deterministic, not DB-accidental: sort by type, then
   value, then id (locale-aware, accent-insensitive), applied in the service
   layer. The type ranking lives in a constant so merchandising can pin a
   configurable order later without touching the code paths.
5. **Resolution endpoint** (required because URLs are slug-only — on refresh or
   deep link the client holds nothing but the slug):
   - `GET /product-variants/by-slug/:variantSlug` — `@Public()`, increments
     `views` (same as `GET /products/:id/variant/:variantId`).
   - Response: `{ ...full product, variant: <selected variant> }` (shape to be
     normalized with frontend during pairing tests).
   - `404` if not found; `409` if more than one live row matches (defensive —
     the unique index makes it unreachable among live rows).
6. **Write paths that generate the slug**: `ProductService.createEntity`
   (nested variants), `ProductService.addNewProductVariant`,
   `ProductVariantService.updateEntity` — always inside `dataSource.transaction`.
   Slugs are **not** regenerated on later attribute/brand/name edits.

## API contract — variants always carry their context

Every endpoint that returns variants (the paginated `GET /product-variants`,
category/sub-category filters, `discount`, `top-sales`, `most-popular`,
`new-arrivals`, `:categoryId/related`, variant detail, `by-slug`) includes at
least:

```json
{
  "id": "uuid-variante",
  "name": "Nombre de la variante",
  "product": { "id": "uuid-producto", "brand": "Marca" },
  "attributes": [
    { "id": "uuid", "type": "Sabor", "value": "Café Moka" },
    { "id": "uuid", "type": "Volumen", "value": "30 ml" }
  ],
  "variantSlug": "cafe-moka-sen-intimo-cafe-moka-30-ml-caliente"
}
```

Attributes are ordered by the stable rule in decision 4 in **every** response.

## Work plan

- **Phase 1 (no schema change)** — attributes present in all variant list
  endpoints (they were missing from the paginated `findAll`), stable attribute
  ordering helper applied across `ProductVariantService` reads.
- **Phase 2 (schema)** — `variant_slug` column + partial unique index +
  backfill migration (slug logic in a plain TS helper, importable from the
  migration); generation wired into the write paths; `by-slug` endpoint.
- **Phase 3 (close-out)** — update `03`/`04`/README, note the partial-index
  decision in `06`, add a runbook (`07`) entry for the backfill migration on
  prod.

## Risks / watch list

- **Backfill hygiene**: brands with inconsistent casing/duplicates will collide
  on base slugs and produce a forest of `-2` suffixes — review the live catalog
  before running the prod migration.
- **Slug is the public identifier**: once URLs are slug-only, a changed or
  missing slug is a dead shared link. The freeze rule (decision 2) and the
  partial index (decision 3) are what keep old URLs alive; do not weaken them.
- **Soft-delete blind spot**: `findAll`'s query builder does not auto-filter
  `deleted_at`; the new `by-slug` endpoint must filter deleted rows (and
  `product.status = Published`) explicitly.
- **No automated tests**: the Jest suite is stale boilerplate (see `06`, #4);
  verification is manual via Swagger/curl unless real specs get seeded with
  this feature.
