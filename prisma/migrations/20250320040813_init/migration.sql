-- CreateTable
CREATE TABLE `users` (
    `sap_id` VARCHAR(10) NOT NULL,
    `password` VARCHAR(50) NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `mobile` VARCHAR(20) NOT NULL,
    `role` ENUM('superadmin', 'mios', 'team_lead', 'director') NOT NULL DEFAULT 'mios',
    `status` ENUM('active', 'inactive') NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_sap_id_key`(`sap_id`),
    UNIQUE INDEX `users_mobile_key`(`mobile`),
    PRIMARY KEY (`sap_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otp` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(100) NOT NULL,
    `code` VARCHAR(6) NOT NULL,
    `expires_at` TIMESTAMP(5) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teams` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_members` (
    `id` VARCHAR(191) NOT NULL,
    `team_id` VARCHAR(100) NOT NULL,
    `user_id` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `team_members_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `team_id` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `folder` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `category_id` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `file` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `filename` VARCHAR(100) NOT NULL,
    `file_type` VARCHAR(100) NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `folder_id` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaign` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `team_id` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz` (
    `id` VARCHAR(191) NOT NULL,
    `campaign_id` VARCHAR(100) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `description` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `question` (
    `id` VARCHAR(191) NOT NULL,
    `quiz_id` VARCHAR(100) NOT NULL,
    `question` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_option` (
    `id` VARCHAR(191) NOT NULL,
    `question_id` VARCHAR(100) NOT NULL,
    `option` VARCHAR(100) NOT NULL,
    `is_correct` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `result` (
    `id` VARCHAR(191) NOT NULL,
    `team_member_id` VARCHAR(100) NOT NULL,
    `answer_id` VARCHAR(100) NOT NULL,
    `score` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `e_detailing` (
    `id` VARCHAR(191) NOT NULL,
    `campaign_id` VARCHAR(100) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `description` VARCHAR(255) NULL,
    `deadline` TIMESTAMP(6) NOT NULL,
    `score_starting` DECIMAL NOT NULL,
    `score_content` DECIMAL NOT NULL,
    `score_presentation` DECIMAL NOT NULL,
    `score_closing` DECIMAL NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `e_detailing_video` (
    `id` VARCHAR(191) NOT NULL,
    `e_detailing_id` VARCHAR(100) NOT NULL,
    `team_member_id` VARCHAR(100) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `e_detailing_score` (
    `id` INTEGER NOT NULL,
    `video_id` VARCHAR(100) NOT NULL,
    `score_starting` DECIMAL NOT NULL,
    `score_content` DECIMAL NOT NULL,
    `score_presentation` DECIMAL NOT NULL,
    `score_closing` DECIMAL NOT NULL,
    `comment` VARCHAR(191) NULL,
    `scored_by` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `otp` ADD CONSTRAINT `otp_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`sap_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_members` ADD CONSTRAINT `team_members_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`sap_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_members` ADD CONSTRAINT `team_members_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `folder` ADD CONSTRAINT `folder_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_folder_id_fkey` FOREIGN KEY (`folder_id`) REFERENCES `folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `campaign` ADD CONSTRAINT `campaign_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz` ADD CONSTRAINT `quiz_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question` ADD CONSTRAINT `question_quiz_id_fkey` FOREIGN KEY (`quiz_id`) REFERENCES `quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_option` ADD CONSTRAINT `quiz_option_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `result` ADD CONSTRAINT `result_team_member_id_fkey` FOREIGN KEY (`team_member_id`) REFERENCES `team_members`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `result` ADD CONSTRAINT `result_answer_id_fkey` FOREIGN KEY (`answer_id`) REFERENCES `quiz_option`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `e_detailing` ADD CONSTRAINT `e_detailing_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `e_detailing_video` ADD CONSTRAINT `e_detailing_video_e_detailing_id_fkey` FOREIGN KEY (`e_detailing_id`) REFERENCES `e_detailing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `e_detailing_video` ADD CONSTRAINT `e_detailing_video_team_member_id_fkey` FOREIGN KEY (`team_member_id`) REFERENCES `team_members`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `e_detailing_score` ADD CONSTRAINT `e_detailing_score_scored_by_fkey` FOREIGN KEY (`scored_by`) REFERENCES `team_members`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `e_detailing_score` ADD CONSTRAINT `e_detailing_score_video_id_fkey` FOREIGN KEY (`video_id`) REFERENCES `e_detailing_video`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
