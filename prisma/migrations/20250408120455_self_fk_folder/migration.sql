/*
  Warnings:

  - You are about to alter the column `score_starting` on the `e_detailing` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.
  - You are about to alter the column `score_content` on the `e_detailing` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.
  - You are about to alter the column `score_presentation` on the `e_detailing` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.
  - You are about to alter the column `score_closing` on the `e_detailing` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.
  - You are about to alter the column `score_starting` on the `e_detailing_score` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.
  - You are about to alter the column `score_content` on the `e_detailing_score` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.
  - You are about to alter the column `score_presentation` on the `e_detailing_score` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.
  - You are about to alter the column `score_closing` on the `e_detailing_score` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.
  - You are about to drop the column `sub_folder_id` on the `file` table. All the data in the column will be lost.
  - You are about to drop the `sub_folder` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `folder_id` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `file_sub_folder_id_fkey`;

-- DropForeignKey
ALTER TABLE `sub_folder` DROP FOREIGN KEY `sub_folder_folder_id_fkey`;

-- DropIndex
DROP INDEX `file_sub_folder_id_fkey` ON `file`;

-- AlterTable
ALTER TABLE `e_detailing` ALTER COLUMN `deadline` DROP DEFAULT,
    MODIFY `score_starting` DECIMAL NOT NULL,
    MODIFY `score_content` DECIMAL NOT NULL,
    MODIFY `score_presentation` DECIMAL NOT NULL,
    MODIFY `score_closing` DECIMAL NOT NULL;

-- AlterTable
ALTER TABLE `e_detailing_score` MODIFY `score_starting` DECIMAL NOT NULL,
    MODIFY `score_content` DECIMAL NOT NULL,
    MODIFY `score_presentation` DECIMAL NOT NULL,
    MODIFY `score_closing` DECIMAL NOT NULL;

-- AlterTable
ALTER TABLE `file` DROP COLUMN `sub_folder_id`,
    ADD COLUMN `folder_id` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `folder` ADD COLUMN `parent_folder_id` VARCHAR(191) NULL,
    MODIFY `category_id` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `otp` ALTER COLUMN `expires_at` DROP DEFAULT;

-- DropTable
DROP TABLE `sub_folder`;

-- AddForeignKey
ALTER TABLE `folder` ADD CONSTRAINT `folder_parent_folder_id_fkey` FOREIGN KEY (`parent_folder_id`) REFERENCES `folder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_folder_id_fkey` FOREIGN KEY (`folder_id`) REFERENCES `folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
