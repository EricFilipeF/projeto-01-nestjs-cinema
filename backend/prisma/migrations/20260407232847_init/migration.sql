-- CreateTable
CREATE TABLE "filmes" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "sinopse" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "classificacao" TEXT NOT NULL,
    "duracao" INTEGER NOT NULL,
    "dataEstreia" TEXT NOT NULL,
    "imagem" TEXT,

    CONSTRAINT "filmes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "capacidade" INTEGER NOT NULL,

    CONSTRAINT "salas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessoes" (
    "id" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "valorIngresso" DOUBLE PRECISION NOT NULL,
    "tipoProjecao" TEXT NOT NULL,
    "filmeId" TEXT NOT NULL,
    "salaId" TEXT NOT NULL,

    CONSTRAINT "sessoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingressos" (
    "id" TEXT NOT NULL,
    "valorInteira" DOUBLE PRECISION NOT NULL,
    "valorMeia" DOUBLE PRECISION NOT NULL,
    "sessaoId" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,

    CONSTRAINT "ingressos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" TEXT NOT NULL,
    "quantidadeInteira" DOUBLE PRECISION NOT NULL,
    "quantidadeMeia" DOUBLE PRECISION NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lanches_comprados" (
    "id" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "pedidoId" TEXT,
    "lancheComboId" TEXT,

    CONSTRAINT "lanches_comprados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lanche_combos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "lanche_combos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_filmeId_fkey" FOREIGN KEY ("filmeId") REFERENCES "filmes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_salaId_fkey" FOREIGN KEY ("salaId") REFERENCES "salas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingressos" ADD CONSTRAINT "ingressos_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "sessoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingressos" ADD CONSTRAINT "ingressos_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lanches_comprados" ADD CONSTRAINT "lanches_comprados_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lanches_comprados" ADD CONSTRAINT "lanches_comprados_lancheComboId_fkey" FOREIGN KEY ("lancheComboId") REFERENCES "lanche_combos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
