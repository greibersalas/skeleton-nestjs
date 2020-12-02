import {MigrationInterface, QueryRunner} from "typeorm";

export class fixTableClinicHistory1606952584578 implements MigrationInterface {
    name = 'fixTableClinicHistory1606952584578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clinic_history" DROP CONSTRAINT "FK_c52179da15d06a56d23e4b3e5bd"`);
        await queryRunner.query(`ALTER TABLE "clinic_history" DROP COLUMN "capus"`);
        await queryRunner.query(`ALTER TABLE "clinic_history" ADD "campus" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinic_history" DROP COLUMN "previousAttentions"`);
        await queryRunner.query(`ALTER TABLE "clinic_history" ADD "previousAttentions" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinic_history" ADD CONSTRAINT "FK_742b28e5eb64132db3e46fbe21d" FOREIGN KEY ("campus") REFERENCES "campus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clinic_history" DROP CONSTRAINT "FK_742b28e5eb64132db3e46fbe21d"`);
        await queryRunner.query(`ALTER TABLE "clinic_history" DROP COLUMN "previousAttentions"`);
        await queryRunner.query(`ALTER TABLE "clinic_history" ADD "previousAttentions" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinic_history" DROP COLUMN "campus"`);
        await queryRunner.query(`ALTER TABLE "clinic_history" ADD "capus" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinic_history" ADD CONSTRAINT "FK_c52179da15d06a56d23e4b3e5bd" FOREIGN KEY ("capus") REFERENCES "campus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
