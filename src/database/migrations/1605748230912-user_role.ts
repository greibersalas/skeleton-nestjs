import {MigrationInterface, QueryRunner} from "typeorm";

export class userRole1605748230912 implements MigrationInterface {
    name = 'userRole1605748230912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("idrole" SERIAL NOT NULL, "name" character varying(20) NOT NULL, "description" text NOT NULL, "estado" smallint NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_915df8eb659525ccf74f0870e3f" PRIMARY KEY ("idrole"))`);
        await queryRunner.query(`CREATE TABLE "users_details" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "lastname" character varying(80), "estado" smallint NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_05b6d195a298be51e8fd56e8bc5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "detail_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_9fc134ca20766e165ad650ee740" UNIQUE ("detail_id")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_a2cecd1a3531c0b041e29ba46e1" UNIQUE ("role_id")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_9fc134ca20766e165ad650ee740" FOREIGN KEY ("detail_id") REFERENCES "users_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("idrole") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_9fc134ca20766e165ad650ee740"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_9fc134ca20766e165ad650ee740"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "detail_id"`);
        await queryRunner.query(`DROP TABLE "users_details"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
