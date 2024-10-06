/*
  Warnings:

  - A unique constraint covering the columns `[OrderId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `linkedorder` DROP FOREIGN KEY `LinkedOrder_orderId_fkey`;

-- CreateIndex
CREATE UNIQUE INDEX `Payment_OrderId_key` ON `Payment`(`OrderId`);

-- AddForeignKey
ALTER TABLE `LinkedOrder` ADD CONSTRAINT `LinkedOrder_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
