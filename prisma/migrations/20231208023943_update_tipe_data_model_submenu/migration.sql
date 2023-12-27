-- DropForeignKey
ALTER TABLE `submenu` DROP FOREIGN KEY `SubMenu_menu_id_fkey`;

-- AlterTable
ALTER TABLE `submenu` MODIFY `menu_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `refresh_token` TEXT NULL DEFAULT null;

-- AddForeignKey
ALTER TABLE `SubMenu` ADD CONSTRAINT `SubMenu_menu_id_fkey` FOREIGN KEY (`menu_id`) REFERENCES `Menu`(`menu_id`) ON DELETE SET NULL ON UPDATE CASCADE;
