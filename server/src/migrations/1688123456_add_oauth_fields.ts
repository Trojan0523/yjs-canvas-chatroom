import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOAuthFields1688123456 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "providerId" VARCHAR,
      ADD COLUMN IF NOT EXISTS "provider" VARCHAR,
      ADD COLUMN IF NOT EXISTS "photo" VARCHAR,
      ADD COLUMN IF NOT EXISTS "displayName" VARCHAR;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN IF EXISTS "providerId",
      DROP COLUMN IF EXISTS "provider",
      DROP COLUMN IF EXISTS "photo",
      DROP COLUMN IF EXISTS "displayName";
    `);
  }
}
