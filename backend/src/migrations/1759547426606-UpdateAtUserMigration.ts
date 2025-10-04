import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAtUserMigration1759547426606 implements MigrationInterface {
    name = 'UpdateAtUserMigration1759547426606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
    }

}
