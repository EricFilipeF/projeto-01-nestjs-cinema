import { ConflictException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComboService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) { }

  async onModuleInit() {
    await this.ensureDefaultCombos();
  }

  private async ensureDefaultCombos() {
    const count = await this.prisma.lancheCombo.count();
    if (count > 0) {
      return;
    }

    const defaultCombos = [
      { nome: 'Combo Pipoca Doce', descricao: '1 Pipoca doce grande + 1 Refrigerante 700ml + 1 Chocolate', preco: 32.00 },
      { nome: 'Combo Pipoca Salgada', descricao: '1 Pipoca salgada grande + 1 Refrigerante 700ml', preco: 28.00 },
      { nome: 'Combo Casal', descricao: '2 Pipocas médias + 2 Refrigerantes 500ml + 2 Chocolates', preco: 55.00 },
      { nome: 'Combo Kids', descricao: '1 Pipoca pequena + 1 Suco + 1 Guloseima', preco: 18.00 },
      { nome: 'Combo Nachos', descricao: '1 Porção de nachos com queijo + 1 Refrigerante 500ml', preco: 25.00 }
    ];

    for (const combo of defaultCombos) {
      await this.prisma.lancheCombo.create({
        data: combo,
      });
    }
  }

  // private async validarComboSemIngressosVinculados(id: string) {
  //   const lancheCombo = await this.prisma.lancheCombo.findUnique({
  //     where: { id },
  //     select: {
  //       id: true,
  //       pedido: {
  //         select: {
  //           id: true,
  //           ingresso: {
  //             select: {
  //               id: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   if (!lancheCombo) {
  //     throw new NotFoundException(`Combo com ID ${id} não encontrado`);
  //   }

  //   if (lancheCombo.pedido && lancheCombo.pedido.ingresso.length > 0) {
  //     throw new ConflictException('Não é possível excluir este combo pois ele está vinculado a um pedido com ingresso(s).');
  //   }
  // }

  async create(createComboDto: CreateComboDto) {
    return this.prisma.lancheCombo.create({
      data: createComboDto,
    });
  }

  async findAll() {
    return this.prisma.lancheCombo.findMany();
  }

  async findOne(id: string) {
    const lancheCombo = await this.prisma.lancheCombo.findUnique({
      where: { id },
    });

    if (!lancheCombo) {
      throw new NotFoundException(`Combo com ID ${id} não encontrado`);
    }

    return lancheCombo;
  }

  async update(id: string, updateComboDto: UpdateComboDto) {
    await this.findOne(id); // Garante que o combo existe antes de atualizar

    return this.prisma.lancheCombo.update({
      where: { id },
      data: updateComboDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Garante que o combo existe antes de tentar remover

    return this.prisma.lancheCombo.delete({
      where: { id },
    });
  }
}
