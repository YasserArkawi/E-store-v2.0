/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Rating_userId_productId_key` ON `Rating`(`userId`, `productId`);
