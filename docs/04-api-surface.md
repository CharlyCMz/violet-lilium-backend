# 04 — API Surface

Base URL: `http://localhost:3000` (dev). No global prefix, no versioning. Swagger UI: `/docs`.
CORS allows only the configured `frontendUrl` origins, methods `GET/POST/PUT/DELETE`
(no `PATCH` anywhere).

Global behavior: request bodies are strictly validated (`whitelist` +
`forbidNonWhitelisted` — unknown properties → **400**); query strings are auto-converted
(`enableImplicitConversion`). All list/detail responses are raw entities (no DTO mapping on
the way out).

## Root

| Method | Path | Handler | Notes |
|---|---|---|---|
| GET | `/` | `AppController.getHello` | Greeting string (Spanish) |

## Categories — `CategoryController` (`src/products/controllers/category.controller.ts`)

| Method | Path | Behavior |
|---|---|---|
| POST | `/categories` | Create (`CreateCategoryDTO`: title, description, imageUrl, viewOrder) |
| GET | `/categories` | All, with `subCategories`, ordered by `viewOrder ASC` |
| GET | `/categories/featured` | Top 5 by summed variant `total_sales` — **raw SQL aggregation** (QueryBuilder `getRawMany`), returns flattened rows |
| GET | `/categories/:id` | One, with `subCategories` (404 if missing) |
| PUT | `/categories/:id` | Partial update |
| DELETE | `/categories/:id` | **Soft** delete |
| DELETE | `/categories/eliminate/:id` | **Hard** delete |

## Sub-categories — `SubCategoryController`

Same verb/layout as categories: `POST/GET /sub-categories`, `GET/PUT/DELETE /sub-categories/:id`,
`DELETE /sub-categories/eliminate/:id`. Detail loads `category` relation; creation requires
`categoryId` (validated via `CategoryService.findOneNoRelations`).

## Attributes — `AttributeController` (file is misspelled `attibute.controller.ts`)

Same layout: `POST/GET /attributes`, `GET/PUT/DELETE /attributes/:id`,
`DELETE /attributes/eliminate/:id`. DTO is just `{type, value}`.

## Products — `ProductController`

| Method | Path | Behavior |
|---|---|---|
| POST | `/products` | Transactional creation of the whole aggregate: product + sub-category links + nested variants with attributes and images; `frontImage` = first image. Body: `CreateProductDTO` |
| POST | `/products/:id/new-variant` | Add a single variant (with attributes/images) to an existing product — transactional |
| GET | `/products/:id/variant/:variantId` | Full product detail with deep relation tree (`productVariants.*`, `category`, `subCategories`); **increments the variant's `views` counter as a side effect** |

Note: there is **no** `GET /products` list, and no `PUT/DELETE` route for products —
`ProductService.updateEntity`/`softDelete` exist but are not wired to the controller.

## Product variants — `ProductVariantController` (the storefront catalog API)

| Method | Path | Behavior |
|---|---|---|
| GET | `/product-variants` | Filtered + paginated list. Query: `categoryId`, `subCategoryId`, `attributeIds`, `status` (default `Published`), `sortBy` (`createdAt`\|`views`\|`price`\|`totalSales`), `sort` (`ASC`\|`DESC`, default `ASC`), `page` (default 1), `limit` (default 20). Envelope: `{data, total, page, limit, totalPages, hasNextPage, hasPreviousPage}` |
| GET | `/product-variants/discount` | All with `discountPrice > 0` + published product, newest first |
| GET | `/product-variants/top-sales` | Top 10 by `totalSales` |
| GET | `/product-variants/most-popular` | Top 10 by `views` |
| GET | `/product-variants/new-arrivals` | Top 10 newest |
| GET | `/product-variants/:categoryId/related` | Top 5 by sales within a category |
| GET | `/product-variants/:id` | One, with product/frontImage/attributes |
| PUT | `/product-variants/:id` | Partial update; `stock` update auto-derives `isAvailable`; `attributeIds` replaces the attribute set |

⚠️ **Route-order trap**: the static segments (`discount`, `top-sales`, `most-popular`,
`new-arrivals`) must stay declared **before** `/:id` — Nest matches in declaration order.
`createEntity` is commented out; variants are created via `POST /products` or
`/products/:id/new-variant`.

## Images — `ImageController`

| Method | Path | Behavior |
|---|---|---|
| POST | `/images/group` | Body: raw JSON array of image UUIDs → returns those `Image` rows |

## Product guides — `ProductGuideController`

Standard set: `POST/GET /product-guides`, `GET/PUT/DELETE /product-guides/:id`,
`DELETE /product-eliminate…` i.e. `/product-guides/eliminate/:id`. Create resolves `imageIds`
transactionally; update with `imageIds` **replaces** the image set (unknown ids → 400).

## Sales — `SellController`

| Method | Path | Behavior |
|---|---|---|
| PUT | `/sales/manual-sell` | Body: JSON array of `{productVariantSku, quantity}`. Per item, inside **one transaction**: pessimistic write-lock the variant, verify stock, decrement `stock`, increment `total_sales`, flip `isAvailable=false` when stock hits 0. Any failure rolls back everything. Returns 201/empty body on success |

## Users domain — `UsersModule`

Standard CRUD set on each controller: `users`, `roles`, `persons`, `doc-types`, `addresses`,
`locations` (`POST/GET`, `GET/PUT/DELETE :id`, `DELETE /eliminate/:id`). Creating a `user`
persists the whole graph person → address (with location resolution); passwords are
bcrypt-hashed and `@Exclude`d from responses.

| Method | Path | Behavior |
|---|---|---|
| GET | `/locations?stateName=` | City catalog, optionally filtered by department |
| GET | `/locations/states` | Distinct department names |
| POST | `/locations/massive-upload` | Multipart `file` (.csv). Headers `CityCode,CityName,StateCode,StateName,CountryCode,CountryName`; delimiter auto-detected (`,` or `;`); `countryCode` normalized to uppercase. Duplicates on the composite `(country, state, city)` unique index are rejected per-row, not fatal. Response: `{total, processed, rejected, rejectedProducts[]}` |

Boot seed (idempotent): roles `Admin`/`Customer`, doc types `CC`/`CE`/`NIT`/`PPT`/`TI`. The
bootstrap admin is created manually via `POST /users` (no auth yet to protect it).

Input normalization: a global `TrimStringsPipe` trims every incoming string; `person.mail` is
lower-cased and must satisfy `@IsEmail()`. Nested payloads in the users chain are validated
(`@ValidateNested()` + `@Type()`).

## DTO quick reference

| DTO | Used by | Key fields |
|---|---|---|
| `CreateCategoryDTO` | categories | title, description, imageUrl, viewOrder |
| `CreateSubCategoryDTO` | sub-categories | title, description, categoryId, imageUrl |
| `CreateAttributeDTO` | attributes | type, value |
| `CreateProductDTO` | POST /products | brand, status, cautions[], howToUse, cleaningCare[], categoryId, subCategoryIds[], **productVariants[] (non-empty)** |
| `CreateProductVariantDTO` | nested in product DTOs | sku, name, description, specifications[], cost, price, discountPrice?, stock (≥0 int), isAvailable, attributeIds[] (UUIDv4), frontImageId?, images[] |
| `GetProductVariantFiltersDTO` | GET /product-variants | see table above |
| `CreateProductGuideDTO` | product-guides | guideName, description, shortDescription, tests[], howToUse[], expectations, cleanAndCare[], imageIds[] |
| `ManualSellDTO` | sales | productVariantSku, quantity |
| `CreateUserDTO` | users | username, password, person (CreatePersonDTO), roleId |
| `CreatePersonDTO` | nested in user DTOs | docTypeId, document, name, midname, lastname1, lastname2, mail (valid email, lower-cased), phone, address (CreateAddressDTO) |
| `CreateAddressDTO` | nested in person DTOs | street, reference, suite?, zipCode?, isBilling, isShipping, locationId, personId? |
| `CreateLocationDTO` | locations / massive-upload rows | countryCode (upper-cased), countryName, stateCode, stateName, cityCode, cityName, isActive? (default true) |

All incoming strings are globally trimmed (`TrimStringsPipe` in `main.ts`); `person.mail` is
additionally lower-cased and validated with `@IsEmail`. Nested DTOs validate only where
`@ValidateNested()` + `@Type()` are present (users chain today — see risks doc for the gap in
products/sales).

All `Update*` DTOs are `PartialType(Create…DTO)`. Money fields arrive as **strings**.
