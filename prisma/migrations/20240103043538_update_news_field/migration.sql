/*
  Warnings:

  - You are about to drop the column `comments` on the `News` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `News` DROP COLUMN `comments`;

-- AlterTable
ALTER TABLE `User` MODIFY `refresh_token` TEXT NULL DEFAULT null;
