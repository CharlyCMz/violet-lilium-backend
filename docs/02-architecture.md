# 02 — Architecture

## Architectural style

**Modular monolith** in the idiomatic NestJS sense: one deployable process, decomposed into
feature modules that own their controllers, services, and entities. Inside each module, strict
**layers**:

```
HTTP request
   │  ┌─ global ValidationPipe (whitelist, forbidNonWhitelisted, transform + implicit conversion)
   ▼  │
Controller   (thin: route mapping, delegates immediately)
   ▼
Service      (business logic, transactions, query building, NotFoundException checks)
   ▼
Repository   (TypeORM Repository<T> injected via @InjectRepository, or QueryBuilder)
   ▼
PostgreSQL 15
   ▲
Controller ◄── response (serialized by global ClassSerializerInterceptor)
```

Module map:

```mermaid
flowchart TD
    subgraph AppModule
        AC[AppController] --> AS[AppService]
    end

    subgraph ProductsModule
      direction TB
      PC[7 controllers] --> PS[7 services] --> PE[7 entities]
    end

    subgraph SalesModule
      SC[SellController] --> SS[SellService]
    end

    DB[(DatabaseModule<br/>@Global TypeORM root)]
    CFG[ConfigModule<br/>global, YAML loader]

    DB -->|exports TypeOrmModule| PS
    DB -->|exports TypeOrmModule| SS
    DB -->|exports TypeOrmModule| US
    CFG --> DB

    subgraph UsersModule
        UC[6 controllers] --> US[7 services] --> UE[6 entities]
    end

    AuthM[AuthModule — empty placeholder]
    UtilM[UtilsModule<br/>CsvProcessorService]
```

| Module | Role | Contents |
|---|---|---|
| `AppModule` | Root | Imports everything; global `ConfigModule.forRoot({ load: [AppConfig], isGlobal: true })`; root greeting endpoint |
| `DatabaseModule` | Infrastructure, `@Global()` | `TypeOrmModule.forRootAsync` reading `database.*` from ConfigService; **exports `TypeOrmModule`** so feature modules never re-import the root connection; entities resolved by glob `__dirname + '/../**/*.entity{.ts,.js}'`; migrations from `database/migrations`; `synchronize: false`, `logging: false` |
| `ProductsModule` | Catalog domain | `TypeOrmModule.forFeature([7 entities])`; 7 controllers, 7 services |
| `SalesModule` | Point of sale | `SellController` + `SellService`; uses `DataSource` directly (no repository injection, no forFeature import) |
| `UsersModule` | Users domain (auth foundation) | `TypeOrmModule.forFeature([6 entities])`; 6 controllers, 7 services (incl. idempotent boot seed for roles/doc-types); exports `PersonService`/`AddressService`/`UserService`; imports `UtilsModule` for the CSV processor |
| `AuthModule` | Auth | JWT login (`POST /auth` → `{accessToken, user}`), `LocalStrategy`/`JwtStrategy`, global `CustomAuthGuard` + `RolesGuard` via `APP_GUARD`; owns `@Public()`/`@Roles()` decorators |
| `UtilsModule` | Shared utils | `CsvProcessorService` (dictionary-based CSV parsing for bulk upload; JSON dictionaries copied to `dist` via `nest-cli.json` assets) |

## Request lifecycle (create a product — the most complex flow)

`POST /products` with nested variants/attributes/images:

1. ValidationPipe validates `CreateProductDTO` (nested `CreateProductVariantDTO[]`).
2. `ProductController.createEntity` → `ProductService.createEntity`.
3. `dataSource.transaction(async manager => …)` wraps everything:
   - verify `categoryId` exists, verify **all** `subCategoryIds` resolve (count check);
   - create + save `Product`;
   - per variant: create + save `ProductVariant`, attach attributes by id (count check),
     create `Image` rows, set `frontImage = first saved image`;
   - re-fetch the product with the full relation tree and return it.
4. Any `NotFoundException` inside rolls the whole transaction back.

See `src/products/services/product.service.ts:42`. The same transaction pattern is used by
`updateEntity`, `addNewProductVariant` (`:166`), `ProductGuideService.createEntity`
(`src/products/services/product-guide.service.ts:41`), and `SellService.manualSell`
(`src/sales/services/sell.service.ts:16`).

## Cross-cutting concerns (bootstrap, `src/main.ts`)

| Concern | Implementation |
|---|---|
| Validation | Global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true, enableImplicitConversion: true })` — unknown properties are **rejected with 400**, and primitives auto-convert (e.g. query strings → numbers) |
| Serialization | Global `ClassSerializerInterceptor` — registered, but entities use no `@Exclude`/`@Expose`, so it currently does nothing |
| CORS | `enableCors({ origin: config violetLilium.frontendUrl, methods: [GET, POST, PUT, DELETE], credentials: true })` |
| OpenAPI | `DocumentBuilder` ("Violet Lilium Sexshop - API", v1.0) → Swagger UI at `/docs` |
| Port | `violetLilium.port ?? 3000` |
| Error mapping | None custom — Nest default map (`NotFoundException` → 404, `BadRequestException` → 400, validation → 400 with constraint list). **No global exception filter, no interceptor logging** |

Notably absent: global route prefix, API versioning, auth guards, rate limiting, security
headers (helmet), request logging.

## Data access architecture

Two coexisting styles, chosen per use case:

1. **Repository API** (`find`, `findOne`, `findBy`, `save`, `softDelete`, `merge`) — simple
   CRUD, relation loading via `relations: [...]`, conditions like `In(...)`, `ILike(...)`,
   `MoreThan(...)`.
2. **QueryBuilder** — anything needing joins/aggregation/pagination:
   - filtered catalog with pagination: `ProductVariantService.findAll`
     (`src/products/services/product-variant.service.ts:35`);
   - featured categories with `SUM(variant.total_sales)` + `GROUP BY` + `LIMIT 5`:
     `CategoryService.featuredCategories` (`src/products/services/category.service.ts:21`);
   - atomic counter increments: `.update().set({ views: () => '"views" + 1' })`.

Money is `numeric(12,4)` and typed as **`string`** in TS — decimal-safe, never `number`
(`cost`, `price`, `discountPrice` on `ProductVariant`).

## Config architecture

- `src/config.ts` default-exports a factory: reads `config.yml` (repo root, one level above
  `dist/`) via `readFileSync` + `yaml.load`, cast to the exported `AppConfig` type
  (`violetLilium.*` + `database.*`).
- `AppModule` loads it via `ConfigModule.forRoot({ load: [AppConfig], isGlobal: true })`.
- Consumers use `ConfigService.get('database.host')`-style dot paths (see `DatabaseModule`,
  `main.ts`).
- The YAML parse depends on `js-yaml`, declared as a direct dependency since 2026-01-25
  (previously resolved only transitively via `@nestjs/swagger`).

## Extension points & seams

- **Adding a feature module**: create module folder mirroring `products/` layout, add
  `TypeOrmModule.forFeature([...entities])`, register in `AppModule` imports.
- **Auth seam**: controllers already carry commented `@UseGuards(CustomAuthGuard)` /
  `@Public()` annotations — when `AuthModule` is built, enabling it means uncommenting those
  lines (plus creating `src/auth/guards/custom-auth.guard.ts` and
  `src/auth/decorators/public.decorator.ts`). A JWT secret is already in config.
- **Mailer seam**: `violetLilium.mailer.token` (Mailersend-format token) sits unused in
  config — evidently planned for transactional email.
- **Abandoned seams** (commented-out code, do not resurrect blindly): `InlineProduct` sales
  entity/relation (`src/products/entities/product-variant.entity.ts:16` and `:72`), a
  `Label` entity (`src/products/dtos/search-bar.dto.ts`).
