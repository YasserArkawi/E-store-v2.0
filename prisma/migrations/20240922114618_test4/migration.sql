/*
  Warnings:

  - Added the required column `paymentType` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment` ADD COLUMN `paymentType` ENUM('VISA', 'MASTER_CARD', 'PAYPAL') NOT NULL;
