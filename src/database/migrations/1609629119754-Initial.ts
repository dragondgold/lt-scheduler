import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1609629119754 implements MigrationInterface {
    name = 'Initial1609629119754';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "CREATE TYPE \"Jobs_jobstatus_enum\" AS ENUM('waiting', 'active', 'stalled', 'completed', 'failed', 'resumed', 'removed', 'unknown')"
        );
        await queryRunner.query(
            'CREATE TABLE "Jobs" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "jobId" uuid NOT NULL, "jobStatus" "Jobs_jobstatus_enum" NOT NULL DEFAULT \'unknown\', "name" character varying NOT NULL, "queue" character varying NOT NULL, "options" jsonb, "data" jsonb NOT NULL, CONSTRAINT "PK_ddbadaace6379f579179949faf2" PRIMARY KEY ("id"))'
        );
        await queryRunner.query('CREATE INDEX "IDX_c64dac49151f9a42928ece840d" ON "Jobs" ("createdAt") ');
        await queryRunner.query('CREATE INDEX "IDX_b69c608c0b1e5653bc9c336fa9" ON "Jobs" ("updatedAt") ');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_b6983e179b202522ee1c2999a9" ON "Jobs" ("jobId") ');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "IDX_b6983e179b202522ee1c2999a9"');
        await queryRunner.query('DROP INDEX "IDX_b69c608c0b1e5653bc9c336fa9"');
        await queryRunner.query('DROP INDEX "IDX_c64dac49151f9a42928ece840d"');
        await queryRunner.query('DROP TABLE "Jobs"');
        await queryRunner.query('DROP TYPE "Jobs_jobstatus_enum"');
    }
}
