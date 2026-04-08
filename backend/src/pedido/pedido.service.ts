import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PedidoService {
  constructor(private readonly prisma: PrismaService) { }

  private mapearPedidoParaResposta(
    pedido: any,
  ) {
    const { lanchePedido, ...pedidoBase } = pedido;

    return {
      ...pedidoBase,
      lanchePedido: (lanchePedido ?? []).map((lanche: any) => ({
        id: lanche.id,
        nome: lanche.lancheCombo?.nome ?? '',
        descricao: lanche.lancheCombo?.descricao ?? '',
        preco: lanche.preco,
        quantidade: lanche.quantidade,
        lancheComboId: lanche.lancheComboId,
      })),
    };
  }

  private async validarCapacidadeSessao(sessaoId: string, quantidadeNovosIngressos: number) {
    if (quantidadeNovosIngressos <= 0) {
      return;
    }

    const sessao = await this.prisma.sessao.findUnique({
      where: { id: sessaoId },
      select: {
        id: true,
        sala: {
          select: {
            capacidade: true,
          },
        },
        ingressos: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!sessao) {
      throw new NotFoundException(`Sessão com ID ${sessaoId} não encontrada`);
    }

    const ingressosJaVendidos = sessao.ingressos.length;
    const totalAposCriacao = ingressosJaVendidos + quantidadeNovosIngressos;

    if (totalAposCriacao > sessao.sala.capacidade) {
      throw new ConflictException(
        `Não foi possível vender o ingresso: a sessão já possui ${ingressosJaVendidos} ingresso(s) vendidos e a sala suporta no máximo ${sessao.sala.capacidade}.`
      );
    }
  }

  private calcularValorTotal(createPedidoDto: CreatePedidoDto): number {
    const primeiroIngresso = createPedidoDto.ingresso[0];
    const valorInteira = primeiroIngresso?.valorInteira ?? 0;
    const valorMeia = primeiroIngresso?.valorMeia ?? 0;

    const totalIngressos =
      createPedidoDto.quantidadeInteira * valorInteira +
      createPedidoDto.quantidadeMeia * valorMeia;

    return totalIngressos;
  }

  async create(createPedidoDto: CreatePedidoDto) {
    const sessaoId = createPedidoDto.ingresso[0]?.sessaoId;

    if (sessaoId) {
      await this.validarCapacidadeSessao(sessaoId, createPedidoDto.ingresso.length);
    }

    const totalIngressos = this.calcularValorTotal(createPedidoDto);

    const lanchesCompradosData = await Promise.all(
      (createPedidoDto.lanchePedido ?? []).map(async (combo) => {
        const comboCatalogo = await this.prisma.lancheCombo.findUnique({
          where: { id: combo.lancheComboId },
          select: { id: true, preco: true, nome: true },
        });

        if (!comboCatalogo) {
          throw new NotFoundException(
            `Combo com ID ${combo.lancheComboId} não encontrado no catálogo.`,
          );
        }

        return {
          quantidade: combo.quantidade,
          preco: comboCatalogo.preco,
          lancheCombo: {
            connect: {
              id: comboCatalogo.id,
            },
          },
        };
      }),
    );

    const totalLanches = lanchesCompradosData.reduce(
      (acc, lanche) => acc + lanche.preco * lanche.quantidade,
      0,
    );

    const valorTotal = totalIngressos + totalLanches;

    const pedido = await this.prisma.pedido.create({
      data: {
        quantidadeInteira: createPedidoDto.quantidadeInteira,
        quantidadeMeia: createPedidoDto.quantidadeMeia,
        valorTotal,

        ingresso: {
          create: createPedidoDto.ingresso,
        },

        lanchePedido: {
          create: lanchesCompradosData,
        },
      },
      include: {
        ingresso: true,
        lanchePedido: {
          include: {
            lancheCombo: true,
          },
        },
      },
    });

    return this.mapearPedidoParaResposta(pedido);
  }

  async findAll() {
    const pedidos = await this.prisma.pedido.findMany({
      include: {
        ingresso: true,
        lanchePedido: {
          include: {
            lancheCombo: true,
          },
        },
      },
    });

    return pedidos.map((pedido) => this.mapearPedidoParaResposta(pedido));
  }

  async findOne(id: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        ingresso: true,
        lanchePedido: {
          include: {
            lancheCombo: true,
          },
        },
      },
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }

    return this.mapearPedidoParaResposta(pedido);
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto) {
    await this.findOne(id);

    const { ingresso, lanchePedido, ...pedidoData } = updatePedidoDto as any;

    return this.prisma.pedido.update({
      where: { id },
      data: pedidoData,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.pedido.delete({
      where: { id },
    });
  }
}
