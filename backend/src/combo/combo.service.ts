import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComboService {
  constructor(private readonly prisma: PrismaService) { }

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
