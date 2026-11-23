import { MigrationInterface, QueryRunner } from 'typeorm';
import { ProductVariant } from '../../products/entities/product-variant.entity';
import {
  generateVariantSlugBase,
  nextSlugCandidate,
} from '../../utils/slug/slug.utils';

export class VariantSlugs1795384062113 implements MigrationInterface {
  name = 'VariantSlugs1795384062113';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD "variant_slug" character varying`,
    );

    const variants = await queryRunner.manager
      .getRepository(ProductVariant)
      .find({
        relations: ['product', 'attributes'],
        withDeleted: true,
        order: { createdAt: 'ASC', id: 'ASC' },
      });

    const usedSlugs = new Set<string>();
    for (const variant of variants) {
      const base = generateVariantSlugBase(
        variant.name,
        variant.product?.brand ?? '',
        variant.attributes ?? [],
      );
      let attempt = 1;
      let candidate = nextSlugCandidate(base, attempt);
      while (usedSlugs.has(candidate)) {
        attempt += 1;
        candidate = nextSlugCandidate(base, attempt);
      }
      usedSlugs.add(candidate);
      await queryRunner.query(
        `UPDATE "product_variants" SET "variant_slug" = $1 WHERE "id" = $2`,
        [candidate, variant.id],
      );
    }

    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "variant_slug" SET NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_product_variants_variant_slug" ON "product_variants" ("variant_slug") WHERE "deleted_at" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."UQ_product_variants_variant_slug"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP COLUMN "variant_slug"`,
    );
  }
}
