import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDatabase1759674926226 implements MigrationInterface {
    name = 'UpdateDatabase1759674926226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."files_type_enum" AS ENUM('poster', 'background', 'trailer')`);
        await queryRunner.query(`CREATE TABLE "files" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "url" text NOT NULL, "type" "public"."files_type_enum" NOT NULL, "key" character varying(100) NOT NULL, "alt_text" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "movieId" integer, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."movies_language_enum" AS ENUM('Inglês', 'Espanhol', 'Português', 'Mandarim')`);
        await queryRunner.query(`CREATE TABLE "movies" ("id" SERIAL NOT NULL, "title" character varying(100) NOT NULL, "original_title" character varying(100) NOT NULL, "subtitle" character varying(100) NOT NULL, "director" character varying(100) NOT NULL, "synopsis" text NOT NULL, "duration" integer NOT NULL, "age_rating" integer NOT NULL, "genres" character varying(100) NOT NULL, "rating" integer NOT NULL, "release_date" date NOT NULL, "language" "public"."movies_language_enum" NOT NULL, "revenue" numeric(15,2) NOT NULL, "budget" numeric(15,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_51b8b26ac168fbe7d6f5653e6cf" UNIQUE ("name"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_d65d5729df59c4995bfdc1eb669" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movies" ADD CONSTRAINT "FK_64a78407424745d6c053e93cc36" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies" DROP CONSTRAINT "FK_64a78407424745d6c053e93cc36"`);
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_d65d5729df59c4995bfdc1eb669"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "movies"`);
        await queryRunner.query(`DROP TYPE "public"."movies_language_enum"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP TYPE "public"."files_type_enum"`);
    }

}
