import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseSchema1793650044833 implements MigrationInterface {
    name = 'BaseSchema1793650044833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_guides" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guide_name" character varying NOT NULL, "description" text NOT NULL, "short_description" text NOT NULL DEFAULT '', "tests" text array, "how_to_use" text array, "expectations" text NOT NULL, "clean_and_care" text array, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_f6a9de641c928a346e4a1004be9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reference" character varying(156) NOT NULL, "url" character varying(1024) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "productVariantId" uuid, "productGuideId" uuid, CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "attributes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying(156) NOT NULL, "value" character varying(156) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_32216e2e61830211d3a5d7fa72c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_variants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sku" character varying(256) NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "specifications" text array, "cost" numeric(12,4) NOT NULL, "price" numeric(12,4) NOT NULL, "discountPrice" numeric(12,4) NOT NULL DEFAULT '0', "stock" integer NOT NULL DEFAULT '0', "is_available" boolean NOT NULL DEFAULT false, "views" integer NOT NULL DEFAULT '0', "total_sales" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "productId" uuid, "frontImageId" uuid, CONSTRAINT "UQ_46f236f21640f9da218a063a866" UNIQUE ("sku"), CONSTRAINT "PK_281e3f2c55652d6a22c0aa59fd7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."products_status_enum" AS ENUM('Draft', 'Published')`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "brand" character varying NOT NULL, "status" "public"."products_status_enum" NOT NULL DEFAULT 'Draft', "cautions" text array, "how_to_use" text, "cleaning_care" text array, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "categoryId" uuid, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(156) NOT NULL, "description" text NOT NULL, "image_url" character varying, "view_order" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_aa79448dc3e959720ab4c13651d" UNIQUE ("title"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sub_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(156) NOT NULL, "description" text, "image_url" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "categoryId" uuid, CONSTRAINT "UQ_bba54c1fa6399cf87ff350f55f6" UNIQUE ("title"), CONSTRAINT "PK_f319b046685c0e07287e76c5ab1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_variants_attributes" ("productVariantsId" uuid NOT NULL, "attributesId" uuid NOT NULL, CONSTRAINT "PK_c91b00de2e95b4ac3f87c4553c0" PRIMARY KEY ("productVariantsId", "attributesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_83ad80326e537742733e25949e" ON "product_variants_attributes" ("productVariantsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_931bf7eef6688c0f325d793206" ON "product_variants_attributes" ("attributesId") `);
        await queryRunner.query(`CREATE TABLE "products_sub_categories" ("productsId" uuid NOT NULL, "subCategoriesId" uuid NOT NULL, CONSTRAINT "PK_e438ecc52cfaa0ae8f5e1f8a95d" PRIMARY KEY ("productsId", "subCategoriesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_120de7cc79a9e7a715bff7f78a" ON "products_sub_categories" ("productsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_731bec0c6843c16a6f19d058f9" ON "products_sub_categories" ("subCategoriesId") `);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_5efce4285dfc3a653c51ece21bf" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_3b0310690ada98459ff710facac" FOREIGN KEY ("productGuideId") REFERENCES "product_guides"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD CONSTRAINT "FK_f515690c571a03400a9876600b5" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD CONSTRAINT "FK_9954b6cff42bd3c3ce5e83261a1" FOREIGN KEY ("frontImageId") REFERENCES "images"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sub_categories" ADD CONSTRAINT "FK_dfa3adf1b46e582626b295d0257" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_variants_attributes" ADD CONSTRAINT "FK_83ad80326e537742733e25949ea" FOREIGN KEY ("productVariantsId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_variants_attributes" ADD CONSTRAINT "FK_931bf7eef6688c0f325d7932060" FOREIGN KEY ("attributesId") REFERENCES "attributes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products_sub_categories" ADD CONSTRAINT "FK_120de7cc79a9e7a715bff7f78ab" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "products_sub_categories" ADD CONSTRAINT "FK_731bec0c6843c16a6f19d058f9d" FOREIGN KEY ("subCategoriesId") REFERENCES "sub_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products_sub_categories" DROP CONSTRAINT "FK_731bec0c6843c16a6f19d058f9d"`);
        await queryRunner.query(`ALTER TABLE "products_sub_categories" DROP CONSTRAINT "FK_120de7cc79a9e7a715bff7f78ab"`);
        await queryRunner.query(`ALTER TABLE "product_variants_attributes" DROP CONSTRAINT "FK_931bf7eef6688c0f325d7932060"`);
        await queryRunner.query(`ALTER TABLE "product_variants_attributes" DROP CONSTRAINT "FK_83ad80326e537742733e25949ea"`);
        await queryRunner.query(`ALTER TABLE "sub_categories" DROP CONSTRAINT "FK_dfa3adf1b46e582626b295d0257"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`);
        await queryRunner.query(`ALTER TABLE "product_variants" DROP CONSTRAINT "FK_9954b6cff42bd3c3ce5e83261a1"`);
        await queryRunner.query(`ALTER TABLE "product_variants" DROP CONSTRAINT "FK_f515690c571a03400a9876600b5"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_3b0310690ada98459ff710facac"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_5efce4285dfc3a653c51ece21bf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_731bec0c6843c16a6f19d058f9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_120de7cc79a9e7a715bff7f78a"`);
        await queryRunner.query(`DROP TABLE "products_sub_categories"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_931bf7eef6688c0f325d793206"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_83ad80326e537742733e25949e"`);
        await queryRunner.query(`DROP TABLE "product_variants_attributes"`);
        await queryRunner.query(`DROP TABLE "sub_categories"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TYPE "public"."products_status_enum"`);
        await queryRunner.query(`DROP TABLE "product_variants"`);
        await queryRunner.query(`DROP TABLE "attributes"`);
        await queryRunner.query(`DROP TABLE "images"`);
        await queryRunner.query(`DROP TABLE "product_guides"`);
    }

}
