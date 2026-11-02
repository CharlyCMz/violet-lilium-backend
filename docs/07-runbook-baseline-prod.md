# 07 — Runbook: Línea base de migraciones en producción

> **Preparado:** 2026-02-11 · Baseline: `BaseSchema1793650044833` (timestamp `1793650044833`)
> Ejecutar una sola vez por ambiente existente (dev local ya quedó marcado). Ambientes nuevos
> y vacíos no usan este runbook: ahí basta con `npm run migration:run`.

## Por qué esto no toca la data

- La migración baseline contiene los `CREATE TABLE` del schema completo, pero **solo se
  ejecuta sobre bases vacías**. El schema de prod ya existe y coincide (se verifica en el
  Paso 2), así que en prod **no se ejecuta**: se marca como aplicada.
- Lo único que toca la base de prod en todo el proceso: la creación de la tabla `migrations`
  (metadatos de TypeORM, vacía) y **un INSERT de un registro** en ella.
- Ningún `ALTER`, `DROP` o `DELETE` sobre las tablas de datos. Los productos existentes no
  se ven afectados.

## Paso 1 — Backup (obligatorio, aunque el proceso no toca data)

En el Droplet (ajustar usuario/host según el `config.yml` de prod; si prod corre en Docker
allí, envolver con `docker exec`):

```bash
pg_dump -U <prod_user> -h localhost -d violet_lilium_db \
  -f backup_pre_baseline_$(date +%F).sql
```

Verificar que el archivo tiene tamaño razonable y empieza con cabecera PostgreSQL.

## Paso 2 — Candado de paridad de schema (gate de seguridad)

La línea base se generó desde el schema de dev. Antes de marcarla en prod, confirmar que son
idénticos:

```bash
# En el Droplet:
pg_dump -U <prod_user> -h localhost --schema-only -d violet_lilium_db > prod_schema.sql

# En la máquina de dev:
docker compose exec postgres pg_dump -U root --schema-only -d violet_lilium_db > dev_schema.sql

# Comparar (diferencias de ownership/comentarios son aceptables):
diff dev_schema.sql prod_schema.sql
```

**Si hay diferencias estructurales: detenerse.** Aclarar la divergencia primero (lo más
probable: prod arrancó alguna vez con otra versión del código). Opciones: alinear prod al
schema de las entidades, o regenerar el baseline contra una réplica del schema real de prod.

## Paso 3 — Deploy del código

```bash
git pull
npm ci
npm run build
```

Con este build, la app ya corre con `synchronize: false`: arranca contra el schema existente
sin mutarlo (mismo comportamiento validado en dev).

## Paso 4 — Crear la tabla `migrations`

```bash
npm run migration:show
```

TypeORM crea automáticamente la tabla `migrations` y muestra:
`[ ] 1 BaseSchema1793650044833` (pendiente). **No ejecutar `migration:run` aquí** — eso
intentaría los CREATE TABLE sobre el schema existente.

## Paso 5 — Marcar la línea base como aplicada

Desde cualquier cliente `psql` con acceso a la base de prod:

```sql
INSERT INTO "migrations"("timestamp","name")
VALUES (1793650044833, 'BaseSchema1793650044833');
```

## Paso 6 — Verificación

```bash
npm run migration:show        # debe mostrar: [X] 1 BaseSchema1793650044833
# Reiniciar la app (pm2 restart / systemctl / el gestor que uses)
curl https://<tu-dominio>/                       # → saludo de la API
curl -o /dev/null -w '%{http_code}' https://<tu-dominio>/docs   # → 200
```

Spot-check de data: un conteo rápido de productos/variantes antes vs. después debe ser
idéntico (p.ej. `SELECT count(*) FROM products;`).

## Flujo habitual de aquí en adelante

1. **Dev:** editar entidad → `npm run migration:generate -- src/database/migrations/<NombreCambio>`
   → revisar el SQL generado → commit (siempre revisar antes de commitear).
2. **Prod:** `git pull` → `npm ci` → `npm run build` → `npm run migration:run` → reiniciar app.
3. **Revertir la última migración:** `npm run migration:revert`. Para emergencias mayores:
   restore del backup del Paso 1.

## Advertencias

- Jamás correr `migration:run` en prod sin haber leído el archivo de migración correspondiente.
- Si una migración futura falla a mitad, la transación se revierte sola — leer el error,
  corregir con una migración nueva (no editar la ya commiteada si ya corrió en algún ambiente).
- Olvidar `synchronize`: el app nunca más muta el schema. Toda evolución pasa por migración.
