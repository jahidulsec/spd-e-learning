/*
  Warnings:

  - You are about to drop the column `campaign_id` on the `e_detailing` table. All the data in the column will be lost.
  - You are about to alter the column `score_starting` on the `e_detailing` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.
  - You are about to alter the column `score_content` on the `e_detailing` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.
  - You are about to alter the column `score_presentation` on the `e_detailing` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.
  - You are about to alter the column `score_closing` on the `e_detailing` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.
  - You are about to alter the column `score_starting` on the `e_detailing_score` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.
  - You are about to alter the column `score_content` on the `e_detailing_score` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.
  - You are about to alter the column `score_presentation` on the `e_detailing_score` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.
  - You are about to alter the column `score_closing` on the `e_detailing_score` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.
  - You are about to drop the column `end_date` on the `quater` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `quater` table. All the data in the column will be lost.
  - You are about to drop the column `campaign_id` on the `quiz` table. All the data in the column will be lost.
  - You are about to drop the `campaign` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[filename]` on the table `file` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `quater_id` to the `e_detailing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_id` to the `e_detailing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_id` to the `quiz` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `campaign` DROP FOREIGN KEY `campaign_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `e_detailing` DROP FOREIGN KEY `e_detailing_campaign_id_fkey`;

-- DropForeignKey
ALTER TABLE `quiz` DROP FOREIGN KEY `quiz_campaign_id_fkey`;

-- DropIndex
DROP INDEX `e_detailing_campaign_id_fkey` ON `e_detailing`;

-- DropIndex
DROP INDEX `quiz_campaign_id_fkey` ON `quiz`;

-- AlterTable
ALTER TABLE `e_detailing` DROP COLUMN `campaign_id`,
    ADD COLUMN `quater_id` VARCHAR(100) NOT NULL,
    ADD COLUMN `team_id` VARCHAR(100) NOT NULL,
    ALTER COLUMN `deadline` DROP DEFAULT,
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
ALTER TABLE `quater` DROP COLUMN `end_date`,
    DROP COLUMN `start_date`;

-- AlterTable
ALTER TABLE `quiz` DROP COLUMN `campaign_id`,
    ADD COLUMN `team_id` VARCHAR(100) NOT NULL;

-- DropTable
DROP TABLE `campaign`;

-- CreateIndex
CREATE UNIQUE INDEX `file_filename_key` ON `file`(`filename`);

-- AddForeignKey
ALTER TABLE `quiz` ADD CONSTRAINT `quiz_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `e_detailing` ADD CONSTRAINT `e_detailing_quater_id_fkey` FOREIGN KEY (`quater_id`) REFERENCES `quater`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `e_detailing` ADD CONSTRAINT `e_detailing_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
