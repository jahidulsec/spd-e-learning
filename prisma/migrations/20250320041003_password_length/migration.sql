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
ALTER TABLE `users` MODIFY `password` VARCHAR(255) NULL;
