import {MigrationInterface, QueryRunner} from "typeorm";

export class fixTableClinicHistor1606952798233 implements MigrationInterface {
    name = 'fixTableClinicHistor1606952798233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clinic_history" DROP COLUMN "documentNumber"`);
        await queryRunner.query(`ALTER TABLE "clinic_history" ADD "documentNumber" character varying(15) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clinic_history" DROP COLUMN "documentNumber"`);
        await queryRunner.query(`ALTER TABLE "clinic_history" ADD "documentNumber" bigint NOT NULL`);
    }

}
