/*
  Warnings:

  - You are about to drop the column `quantidadeUnidade` on the `lanche_combos` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `lanche_combos` table. All the data in the column will be lost.
  - You are about to drop the column `valorUnitario` on the `lanche_combos` table. All the data in the column will be lost.
  - Added the required column `preco` to the `lanche_combos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lanche_combos" DROP COLUMN "quantidadeUnidade",
DROP COLUMN "subtotal",
DROP COLUMN "valorUnitario",
ADD COLUMN     "preco" DOUBLE PRECISION NOT NULL;
