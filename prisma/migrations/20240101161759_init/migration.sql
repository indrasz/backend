/*
  Warnings:

  - You are about to drop the column `name` on the `UserKlien` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `UserKlien` table. All the data in the column will be lost.
  - Added the required column `alamat` to the `UserKlien` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama_lengkap` to the `UserKlien` table without a default value. This is not possible if the table is not empty.
  - Added the required column `no_hp` to the `UserKlien` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggal_lahir` to the `UserKlien` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `refresh_token` TEXT NULL DEFAULT null;

-- AlterTable
ALTER TABLE `UserKlien` DROP COLUMN `name`,
    DROP COLUMN `username`,
    ADD COLUMN `alamat` VARCHAR(191) NOT NULL,
    ADD COLUMN `nama_lengkap` VARCHAR(191) NOT NULL,
    ADD COLUMN `no_hp` VARCHAR(191) NOT NULL,
    ADD COLUMN `tanggal_lahir` DATE NOT NULL,
    MODIFY `refresh_token` TEXT NULL DEFAULT null;
