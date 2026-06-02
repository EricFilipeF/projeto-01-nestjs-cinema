import { PrismaService } from './prisma/prisma.service';

const prisma = new PrismaService();

async function main() {
  const pedidos = await prisma.pedido.findMany({
    include: {
      ingresso: {
        include: {
          sessao: {
            include: {
              filme: true,
            }
          }
        }
      },
      lanchePedido: true,
    }
  });

  console.log('--- PEDIDOS NO BANCO ---');
  console.log(JSON.stringify(pedidos, null, 2));
  console.log('Total de pedidos:', pedidos.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
