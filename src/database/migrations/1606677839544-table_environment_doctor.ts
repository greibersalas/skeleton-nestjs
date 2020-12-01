import {MigrationInterface, QueryRunner} from "typeorm";

export class tableEnvironmentDoctor1606677839544 implements MigrationInterface {
    name = 'tableEnvironmentDoctor1606677839544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "environment_doctor" ("id" SERIAL NOT NULL, "name" character varying(40) NOT NULL, "description" character varying, "state" smallint NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "idcampus" integer NOT NULL, "idbusinessline" integer NOT NULL, CONSTRAINT "UQ_11c64fc34f4db1fd92758f9c9e6" UNIQUE ("name"), CONSTRAINT "PK_59028db1233ca690886fc8f5d6e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "environment_doctor" ADD CONSTRAINT "FK_af23c1e3c6e1c6cdd452f4e990b" FOREIGN KEY ("idcampus") REFERENCES "campus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "environment_doctor" ADD CONSTRAINT "FK_0feb497107fbe4113ec97356f23" FOREIGN KEY ("idbusinessline") REFERENCES "business_line"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "environment_doctor" DROP CONSTRAINT "FK_0feb497107fbe4113ec97356f23"`);
        await queryRunner.query(`ALTER TABLE "environment_doctor" DROP CONSTRAINT "FK_af23c1e3c6e1c6cdd452f4e990b"`);
        await queryRunner.query(`DROP TABLE "environment_doctor"`);
    }

}
