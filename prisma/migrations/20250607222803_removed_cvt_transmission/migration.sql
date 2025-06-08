/*
  Warnings:

  - The values [cvt] on the enum `TransmissionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransmissionType_new" AS ENUM ('automatic', 'manual', 'other');
ALTER TABLE "Trim" ALTER COLUMN "transmissionType" TYPE "TransmissionType_new" USING ("transmissionType"::text::"TransmissionType_new");
ALTER TYPE "TransmissionType" RENAME TO "TransmissionType_old";
ALTER TYPE "TransmissionType_new" RENAME TO "TransmissionType";
DROP TYPE "TransmissionType_old";
COMMIT;
