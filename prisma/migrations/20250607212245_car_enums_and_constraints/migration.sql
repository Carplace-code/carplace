/*
  Warnings:

  - The `bodyType` column on the `Model` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,brandId]` on the table `Model` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[modelId,year]` on the table `Version` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `fuelType` on the `Trim` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `transmissionType` on the `Trim` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BodyType" AS ENUM ('sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'wagon', 'van', 'truck', 'other');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('gas', 'diesel', 'electricity', 'hybrid', 'other');

-- CreateEnum
CREATE TYPE "TransmissionType" AS ENUM ('automatic', 'manual', 'cvt', 'other');

-- AlterTable
ALTER TABLE "Model" DROP COLUMN "bodyType",
ADD COLUMN     "bodyType" "BodyType";

-- AlterTable
ALTER TABLE "Trim" DROP COLUMN "fuelType",
ADD COLUMN     "fuelType" "FuelType" NOT NULL,
DROP COLUMN "transmissionType",
ADD COLUMN     "transmissionType" "TransmissionType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Model_name_brandId_key" ON "Model"("name", "brandId");

-- CreateIndex
CREATE UNIQUE INDEX "Version_modelId_year_key" ON "Version"("modelId", "year");
