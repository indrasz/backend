/*
  Warnings:

  - A unique constraint covering the columns `[subMenu_name]` on the table `SubMenu` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `refresh_token` TEXT NULL DEFAULT null;

-- CreateIndex
CREATE UNIQUE INDEX `SubMenu_subMenu_name_key` ON `SubMenu`(`subMenu_name`);
