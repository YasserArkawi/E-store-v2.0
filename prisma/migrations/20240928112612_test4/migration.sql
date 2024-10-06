/*
  Warnings:

  - Made the column `rating` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `rating` DOUBLE NOT NULL DEFAULT 0;
