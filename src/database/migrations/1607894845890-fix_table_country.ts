import {MigrationInterface, QueryRunner} from "typeorm";

export class fixTableCountry1607894845890 implements MigrationInterface {
    name = 'fixTableCountry1607894845890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "countrys" DROP CONSTRAINT "FK_13a2ada859bc70c530bb64582ec"`);
        await queryRunner.query(`ALTER TABLE "countrys" ALTER COLUMN "user" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "countrys"."user" IS NULL`);
        await queryRunner.query(`ALTER TABLE "countrys" ADD CONSTRAINT "FK_13a2ada859bc70c530bb64582ec" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "countrys" DROP CONSTRAINT "FK_13a2ada859bc70c530bb64582ec"`);
        await queryRunner.query(`COMMENT ON COLUMN "countrys"."user" IS NULL`);
        await queryRunner.query(`ALTER TABLE "countrys" ALTER COLUMN "user" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "countrys" ADD CONSTRAINT "FK_13a2ada859bc70c530bb64582ec" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
