import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATETABLES1696196401938 implements MigrationInterface {
    name = 'CREATETABLES1696196401938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "location" ("id" SERIAL NOT NULL, "latitude" numeric(10,6) NOT NULL, "longitude" numeric(10,6) NOT NULL, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "person" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(40) NOT NULL, CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "driver" ("id" SERIAL NOT NULL, "available" boolean NOT NULL, "personId" integer, "locationId" integer, CONSTRAINT "REL_a1627d34fa5d5d4cafec64f4ad" UNIQUE ("personId"), CONSTRAINT "REL_086f04cdd455811580e54dc2c4" UNIQUE ("locationId"), CONSTRAINT "PK_61de71a8d217d585ecd5ee3d065" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "passenger" ("id" SERIAL NOT NULL, "personId" integer, CONSTRAINT "REL_51eb4f02a334dec4cef7882dd5" UNIQUE ("personId"), CONSTRAINT "PK_50e940dd2c126adc20205e83fac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."ride_status_enum" AS ENUM('waiting', 'active', 'finished', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "ride" ("id" SERIAL NOT NULL, "status" "public"."ride_status_enum" NOT NULL, "passengerId" integer, "driverId" integer, "startLocationId" integer, "endLocationId" integer, CONSTRAINT "REL_bee1577baab3b67c4e66efc0c5" UNIQUE ("startLocationId"), CONSTRAINT "REL_b2151007c37387b05e55f62599" UNIQUE ("endLocationId"), CONSTRAINT "PK_f6bc30c4dd875370bafcb54af1b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invoice" ("id" SERIAL NOT NULL, "amount" numeric NOT NULL, "date" TIMESTAMP NOT NULL, "rideId" integer, CONSTRAINT "REL_6544df3f240651944935d48d64" UNIQUE ("rideId"), CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "driver" ADD CONSTRAINT "FK_a1627d34fa5d5d4cafec64f4ad0" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver" ADD CONSTRAINT "FK_086f04cdd455811580e54dc2c45" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "passenger" ADD CONSTRAINT "FK_51eb4f02a334dec4cef7882dd5f" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ride" ADD CONSTRAINT "FK_1699e40f3304c5b41371e271128" FOREIGN KEY ("passengerId") REFERENCES "passenger"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ride" ADD CONSTRAINT "FK_a212335bd593ecd23b665309e9d" FOREIGN KEY ("driverId") REFERENCES "driver"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ride" ADD CONSTRAINT "FK_bee1577baab3b67c4e66efc0c52" FOREIGN KEY ("startLocationId") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ride" ADD CONSTRAINT "FK_b2151007c37387b05e55f62599e" FOREIGN KEY ("endLocationId") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_6544df3f240651944935d48d644" FOREIGN KEY ("rideId") REFERENCES "ride"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_6544df3f240651944935d48d644"`);
        await queryRunner.query(`ALTER TABLE "ride" DROP CONSTRAINT "FK_b2151007c37387b05e55f62599e"`);
        await queryRunner.query(`ALTER TABLE "ride" DROP CONSTRAINT "FK_bee1577baab3b67c4e66efc0c52"`);
        await queryRunner.query(`ALTER TABLE "ride" DROP CONSTRAINT "FK_a212335bd593ecd23b665309e9d"`);
        await queryRunner.query(`ALTER TABLE "ride" DROP CONSTRAINT "FK_1699e40f3304c5b41371e271128"`);
        await queryRunner.query(`ALTER TABLE "passenger" DROP CONSTRAINT "FK_51eb4f02a334dec4cef7882dd5f"`);
        await queryRunner.query(`ALTER TABLE "driver" DROP CONSTRAINT "FK_086f04cdd455811580e54dc2c45"`);
        await queryRunner.query(`ALTER TABLE "driver" DROP CONSTRAINT "FK_a1627d34fa5d5d4cafec64f4ad0"`);
        await queryRunner.query(`DROP TABLE "invoice"`);
        await queryRunner.query(`DROP TABLE "ride"`);
        await queryRunner.query(`DROP TYPE "public"."ride_status_enum"`);
        await queryRunner.query(`DROP TABLE "passenger"`);
        await queryRunner.query(`DROP TABLE "driver"`);
        await queryRunner.query(`DROP TABLE "person"`);
        await queryRunner.query(`DROP TABLE "location"`);
    }

}
