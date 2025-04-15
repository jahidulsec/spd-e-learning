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
  - You are about to drop the column `option` on the `quiz_option` table. All the data in the column will be lost.
  - Added the required column `title` to the `quiz_option` table without a default value. This is not possible if the table is not empty.

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
ALTER TABLE `quiz_option` DROP COLUMN `option`,
    ADD COLUMN `title` VARCHAR(100) NOT NULL;
