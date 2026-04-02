/*
  Warnings:

  - You are about to drop the column `tipo` on the `ingressos` table. All the data in the column will be lost.
  - You are about to drop the column `valor` on the `ingressos` table. All the data in the column will be lost.
  - You are about to drop the column `valorInte` on the `pedidos` table. All the data in the column will be lost.
  - Added the required column `pedidoId` to the `ingressos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorInteira` to the `ingressos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorMeia` to the `ingressos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantidadeInteira` to the `pedidos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantidadeMeia` to the `pedidos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ingressos" DROP COLUMN "tipo",
DROP COLUMN "valor",
ADD COLUMN     "pedidoId" TEXT NOT NULL,
ADD COLUMN     "valorInteira" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "valorMeia" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "pedidos" DROP COLUMN "valorInte",
ADD COLUMN     "quantidadeInteira" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantidadeMeia" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "lanche_combos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valorUnitario" DOUBLE PRECISION NOT NULL,
    "quantidadeUnidade" INTEGER NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "pedidoId" TEXT,

    CONSTRAINT "lanche_combos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ingressos" ADD CONSTRAINT "ingressos_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lanche_combos" ADD CONSTRAINT "lanche_combos_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
