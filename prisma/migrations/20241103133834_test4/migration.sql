/*
  Warnings:

  - You are about to drop the `productimages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `productimages` DROP FOREIGN KEY `ProductImages_ProductId_fkey`;

-- DropTable
DROP TABLE `productimages`;

-- CreateTable
CREATE TABLE `ProducteImages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(191) NOT NULL,
    `ProductId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProducteImages` ADD CONSTRAINT `ProducteImages_ProductId_fkey` FOREIGN KEY (`ProductId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
