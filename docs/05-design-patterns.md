# 05 — Design Patterns & Conventions

How the codebase is built, in pattern language — and the conventions to follow when adding
code so it blends in.

## Implemented patterns

### Layered architecture + Dependency Injection
Controllers depend only on their module's services via constructor injection; services get
`Repository<T>` via `@InjectRepository(T)` (enabled by `TypeOrmModule.forFeature`), plus
`DataSource` where a transaction is needed. No layer skips another.

### Modular monolith (NestJS modules)
Each feature is a self-contained module folder (`controllers/`, `services/`, `entities/`,
`dtos/`). Cross-module imports are minimal; `DatabaseModule` is `@Global()` and exports
`TypeOrmModule` so repositories are injectable everywhere without re-importing the connection.

### Template-method-like CRUD convention
Every entity service implements the same shape — follow it for new services:

| Method | Semantics |
|---|---|
| `createEntity(payload)` | `repository.create()` + `save()` (or a transaction for aggregates) |
| `findAll()` / `findOne(id)` | Load with relations; `findOne` **must** throw `NotFoundException` when missing |
| `updateEntity(id, payload)` | Fetch → `repository.merge(entity, payload)` → `save()` |
| `deleteEntity(id)` | **Soft** delete (`softDelete`) — the "recycle bin" |
| `eliminateEntity(id)` | **Hard** delete (`delete`) — permanent removal |

Controllers mirror this: route order is always `POST /`, `GET /`, static GETs **before**
`GET /:id`, `PUT /:id`, `DELETE /:id`, `DELETE /eliminate/:id`.

### Unit of Work / Transaction script
Multi-entity writes wrap all reads+writes in `dataSource.transaction(async manager => …)`
using the transactional `manager`, never the injected repositories — so partial writes roll
back atomically. Used in: product create/update, variant attach, guide create, manual sell.

### Optimistic UX counters via atomic SQL
Counters are never read-modify-written in JS. They use raw arithmetic inside the UPDATE:

```ts
// src/products/services/product.service.ts:35
.set({ views: () => '"views" + 1' })
// src/sales/services/sell.service.ts:35
totalSales: () => '"total_sales" + ' + quantity,
stock: () => '"stock" - ' + quantity,
```

Race-safe without locks for increments; checkout additionally serializes writers (below).

### Pessimistic locking for stock checkout
`SellService.manualSell` takes `lock: { mode: 'pessimistic_write' }` on the variant row before
checking stock (`src/sales/services/sell.service.ts:21`) — concurrent sells of the same SKU
serialize, preventing overselling.

### CQRS-lite read model
Writes go through entities/repositories; storefront reads are dedicated QueryBuilder selects
with their own shaping (raw aggregation for featured categories, filtered/paginated variant
lists, "top 10" shortcuts). Read models are not reused for writes.

### Pagination envelope
List endpoints that paginate return:

```ts
{ data, total, page, limit, totalPages: Math.ceil(total / limit),
  hasNextPage: page * limit < total, hasPreviousPage: page > 1 }
```

(`src/products/services/product-variant.service.ts:63`)

### DTO pattern with strict validation
- `CreateXDTO` with class-validator decorators + `@ApiProperty`; `UpdateXDTO = PartialType(CreateXDTO)`.
- IDs cross the API as strings and are validated with `@IsUUID('4', {each: true})` where strict.
- Relation replacement is id-list based: client sends `subCategoryIds` / `attributeIds` /
  `imageIds`, services resolve entities and reassign the collection (with a count check that
  **all** ids exist, else 404/400).

### Derived state over stored flags
`isAvailable` follows `stock` (set on every stock update) rather than being independently
managed. `ProductStatus` on the parent `Product` gates the public catalog.

### Front-image convention
First image in a creation payload becomes `frontImage` — a denormalized pointer for list views
so galleries don't need loading.

### Soft-delete as a feature
`@DeleteDateColumn` on every entity gives a "recycle bin" for free; hard delete is a separate,
scary-named endpoint (`eliminate`) for admin cleanup.

## Coding conventions

- **Language**: TypeScript, ESLint type-checked rules (`no-explicit-any` off,
  `no-floating-promises`/`no-unsafe-argument` as warnings) + Prettier. Match existing style.
- **Naming**: entities PascalCase singular (`ProductVariant`), tables snake_case plural
  (`product_variants`); columns snake_case via `name:` option, TS fields camelCase. DTOs end
  in `DTO`. Controllers end in `Controller`, services in `Service`.
- **Errors**: domain failures are `NotFoundException` (missing entity / unresolved ids) or
  `BadRequestException` (business rule, e.g. insufficient stock). No custom exception types.
- **Async**: services are `async` even for single-shot repository calls.
- **Money**: always `numeric(12,4)` mapped to `string`; never float/`number`.
- **Route design**: nouns plural; sub-resources as `/:id/variant/:variantId`; batch fetch is a
  `POST` with an id array (`/images/group`); array bodies accepted directly (`ManualSellDTO[]`).
- **Line endings**: mostly LF; `src/sales/` files are CRLF — normalize if you touch them.

## Anti-patterns present (know them, don't propagate blindly)

- Quasi-polymorphic `Image` (two nullable FKs: `productVariant` / `productGuide`) — see risks doc.
- Views incremented on a GET (non-idempotent read with a write side effect).
- `PUT /sales/manual-sell` for a non-idempotent batch operation (PUT semantics debatable).
