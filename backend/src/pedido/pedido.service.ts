import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PedidoService {
  constructor(private readonly prisma: PrismaService) { }

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

    const totalCombos = (createPedidoDto.lancheCombo ?? []).reduce((total, combo) => {
      return total + combo.preco * (combo.quantidade ?? 1);
    }, 0);

    return totalIngressos + totalCombos;
  }

  async create(createPedidoDto: CreatePedidoDto) {
    const sessaoId = createPedidoDto.ingresso[0]?.sessaoId;

    if (sessaoId) {
      await this.validarCapacidadeSessao(sessaoId, createPedidoDto.ingresso.length);
    }

    const valorTotal = this.calcularValorTotal(createPedidoDto);

    return this.prisma.pedido.create({
      data: {
        quantidadeInteira: createPedidoDto.quantidadeInteira,
        quantidadeMeia: createPedidoDto.quantidadeMeia,
        valorTotal,

        ingresso: {
          create: createPedidoDto.ingresso,
        },

        lancheCombo: {
          create: (createPedidoDto.lancheCombo ?? []).map((combo) => ({
            nome: combo.nome,
            descricao: combo.descricao,
            preco: combo.preco,
            quantidade: combo.quantidade ?? 1,
          })),
        },
      },
      include: {
        ingresso: true,
        lancheCombo: true,
      },
    });
  }

  async findAll() {
    return this.prisma.pedido.findMany({
      include: {
        ingresso: true,
        lancheCombo: true,
      },
    });
  }

  async findOne(id: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        ingresso: true,
        lancheCombo: true,
      },
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }

    return pedido;
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto) {
    await this.findOne(id);

    const { ingresso, lancheCombo, ...pedidoData } = updatePedidoDto as any;

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
