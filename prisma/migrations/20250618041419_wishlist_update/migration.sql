/*
  Warnings:

  - You are about to drop the column `carListingId` on the `WishlistItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[wishlistId,versionId]` on the table `WishlistItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `versionId` to the `WishlistItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WishlistItem" DROP CONSTRAINT "WishlistItem_carListingId_fkey";

-- DropIndex
DROP INDEX "WishlistItem_wishlistId_carListingId_key";

-- AlterTable
ALTER TABLE "WishlistItem" DROP COLUMN "carListingId",
ADD COLUMN     "versionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WishlistItem_wishlistId_versionId_key" ON "WishlistItem"("wishlistId", "versionId");

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "Version"("id") ON DELETE CASCADE ON UPDATE CASCADE;
