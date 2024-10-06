-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_OrderId_fkey`;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_OrderId_fkey` FOREIGN KEY (`OrderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
