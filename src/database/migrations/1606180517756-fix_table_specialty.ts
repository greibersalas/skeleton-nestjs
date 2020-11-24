import {MigrationInterface, QueryRunner} from "typeorm";

export class fixTableSpecialty1606180517756 implements MigrationInterface {
    name = 'fixTableSpecialty1606180517756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "specialty" DROP CONSTRAINT "FK_b8d8076463ebe1f4c665f737200"`);
        await queryRunner.query(`ALTER TABLE "specialty" RENAME COLUMN "businessLinesId" TO "businessLines"`);
        await queryRunner.query(`ALTER TABLE "specialty" ADD CONSTRAINT "FK_79b6dc6ba3c7a78f61db82324e9" FOREIGN KEY ("businessLines") REFERENCES "business_line"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "specialty" DROP CONSTRAINT "FK_79b6dc6ba3c7a78f61db82324e9"`);
        await queryRunner.query(`ALTER TABLE "specialty" RENAME COLUMN "businessLines" TO "businessLinesId"`);
        await queryRunner.query(`ALTER TABLE "specialty" ADD CONSTRAINT "FK_b8d8076463ebe1f4c665f737200" FOREIGN KEY ("businessLinesId") REFERENCES "business_line"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
