import {MigrationInterface, QueryRunner} from "typeorm";

export class tableCountry1607894341272 implements MigrationInterface {
    name = 'tableCountry1607894341272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "countrys" ("id" SERIAL NOT NULL, "name" character varying(30) NOT NULL, "code" character varying(2) NOT NULL, "state" smallint NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user" integer NOT NULL, CONSTRAINT "UQ_9a9a2443e73dfbc6317a5b7386f" UNIQUE ("name"), CONSTRAINT "PK_bf89cd5742ca755b7191999090e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "countrys" ADD CONSTRAINT "FK_13a2ada859bc70c530bb64582ec" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "countrys" DROP CONSTRAINT "FK_13a2ada859bc70c530bb64582ec"`);
        await queryRunner.query(`DROP TABLE "countrys"`);
    }

}
