import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsersSchema1793696002067 implements MigrationInterface {
  name = 'AddUsersSchema1793696002067';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "documentation_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(10) NOT NULL, "name" character varying(48) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_49f4418f514db3a46a1f702ff8f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "locations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country_code" character varying(16) NOT NULL, "country_name" character varying(128) NOT NULL, "state_code" character varying(16) NOT NULL, "state_name" character varying(128) NOT NULL, "city_code" character varying(16) NOT NULL, "city_name" character varying(128) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_73bd6b44e3f24b77cd3fa8e5af" ON "locations" ("country_code", "state_code", "city_code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "street" character varying(64) NOT NULL, "reference" character varying(64) NOT NULL, "suite" character varying(8), "zip_code" character varying(8), "is_billing" boolean NOT NULL DEFAULT false, "is_shipping" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "locationId" uuid, "personId" uuid, CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "persons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "document" character varying(10) NOT NULL, "name" character varying(156) NOT NULL, "middle_name" character varying(156) NOT NULL, "lastname_1" character varying(156) NOT NULL, "lastname_2" character varying(156) NOT NULL, "mail" character varying(156) NOT NULL, "phone" character varying(156) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "docTypeId" uuid, CONSTRAINT "UQ_de39609389126134779dad17ad8" UNIQUE ("mail"), CONSTRAINT "UQ_6545fa46b808c5870a6b27a3adf" UNIQUE ("phone"), CONSTRAINT "PK_74278d8812a049233ce41440ac7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(156) NOT NULL, "description" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(156) NOT NULL, "password" character varying(156) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "personId" uuid NOT NULL, "roleId" uuid NOT NULL, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "REL_ddd0d20e45dbd0d1536dc08203" UNIQUE ("personId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "FK_5bb52f2cbfbeccc311874696434" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "FK_6ddaada195abed3f777438e5bfd" FOREIGN KEY ("personId") REFERENCES "persons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "persons" ADD CONSTRAINT "FK_6f7a49edfb6a48ca741fe335fc2" FOREIGN KEY ("docTypeId") REFERENCES "documentation_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_ddd0d20e45dbd0d1536dc082039" FOREIGN KEY ("personId") REFERENCES "persons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_ddd0d20e45dbd0d1536dc082039"`,
    );
    await queryRunner.query(
      `ALTER TABLE "persons" DROP CONSTRAINT "FK_6f7a49edfb6a48ca741fe335fc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP CONSTRAINT "FK_6ddaada195abed3f777438e5bfd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP CONSTRAINT "FK_5bb52f2cbfbeccc311874696434"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "persons"`);
    await queryRunner.query(`DROP TABLE "addresses"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_73bd6b44e3f24b77cd3fa8e5af"`,
    );
    await queryRunner.query(`DROP TABLE "locations"`);
    await queryRunner.query(`DROP TABLE "documentation_types"`);
  }
}
