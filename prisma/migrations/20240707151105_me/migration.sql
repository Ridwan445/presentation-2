/*
  Warnings:

  - Added the required column `otp` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `otp` VARCHAR(191) NOT NULL;