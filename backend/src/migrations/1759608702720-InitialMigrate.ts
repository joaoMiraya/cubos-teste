import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigrate1759608702720 implements MigrationInterface {
    name = 'InitialMigrate1759608702720'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "images" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "url" character varying(100) NOT NULL, "alt_text" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "movieId" integer, CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ratings" ("id" SERIAL NOT NULL, "rating" integer NOT NULL, "movieId" integer, CONSTRAINT "PK_0f31425b073219379545ad68ed9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."movies_language_enum" AS ENUM('Inglês', 'Espanhol', 'Português', 'Mandarim')`);
        await queryRunner.query(`CREATE TABLE "movies" ("id" SERIAL NOT NULL, "title" character varying(100) NOT NULL, "description" character varying(300) NOT NULL, "duration" integer NOT NULL, "release_date" date NOT NULL, "language" "public"."movies_language_enum" NOT NULL, "revenue" numeric(15,2) NOT NULL, "budget" numeric(15,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movies_categories_categories" ("moviesId" integer NOT NULL, "categoriesId" integer NOT NULL, CONSTRAINT "PK_f76aa01223d41136af04c45f8c2" PRIMARY KEY ("moviesId", "categoriesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3cb1f5cbe98e9bce6d49c6739d" ON "movies_categories_categories" ("moviesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a807323c84e762113e1253deef" ON "movies_categories_categories" ("categoriesId") `);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_152b29050d65f7b6c3888d9d6ec" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "FK_c10d219b6360c74a9f2186b76df" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movies" ADD CONSTRAINT "FK_64a78407424745d6c053e93cc36" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movies_categories_categories" ADD CONSTRAINT "FK_3cb1f5cbe98e9bce6d49c6739dd" FOREIGN KEY ("moviesId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "movies_categories_categories" ADD CONSTRAINT "FK_a807323c84e762113e1253deef9" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies_categories_categories" DROP CONSTRAINT "FK_a807323c84e762113e1253deef9"`);
        await queryRunner.query(`ALTER TABLE "movies_categories_categories" DROP CONSTRAINT "FK_3cb1f5cbe98e9bce6d49c6739dd"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP CONSTRAINT "FK_64a78407424745d6c053e93cc36"`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "FK_c10d219b6360c74a9f2186b76df"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_152b29050d65f7b6c3888d9d6ec"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a807323c84e762113e1253deef"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3cb1f5cbe98e9bce6d49c6739d"`);
        await queryRunner.query(`DROP TABLE "movies_categories_categories"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "movies"`);
        await queryRunner.query(`DROP TYPE "public"."movies_language_enum"`);
        await queryRunner.query(`DROP TABLE "ratings"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "images"`);
    }

}
