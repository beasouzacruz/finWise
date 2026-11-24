-- CreateTable
CREATE TABLE `Ciclo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `mes` VARCHAR(191) NOT NULL,
    `ano` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lancamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(191) NOT NULL,
    `valor` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `categoria` VARCHAR(191) NOT NULL DEFAULT 'Outros',
    `cicloId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Lancamento` ADD CONSTRAINT `Lancamento_cicloId_fkey` FOREIGN KEY (`cicloId`) REFERENCES `Ciclo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
