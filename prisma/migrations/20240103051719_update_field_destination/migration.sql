/*
  Warnings:

  - You are about to drop the column `rating` on the `Destination` table. All the data in the column will be lost.
  - You are about to drop the column `review_count` on the `Destination` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Destination` DROP COLUMN `rating`,
    DROP COLUMN `review_count`;

-- AlterTable
ALTER TABLE `User` MODIFY `refresh_token` TEXT NULL DEFAULT null;
