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
  - Added the required column `quater_id` to the `quiz` table without a default value. This is not possible if the table is not empty.

*/
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
ALTER TABLE `otp` ALTER COLUMN `expires_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `quiz` ADD COLUMN `quater_id` VARCHAR(100) NOT NULL;

-- CreateTable
CREATE TABLE `quater` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `quiz` ADD CONSTRAINT `quiz_quater_id_fkey` FOREIGN KEY (`quater_id`) REFERENCES `quater`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
