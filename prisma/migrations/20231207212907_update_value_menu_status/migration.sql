-- AlterTable
ALTER TABLE `menu` MODIFY `menu_status` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` MODIFY `refresh_token` TEXT NULL DEFAULT null;
