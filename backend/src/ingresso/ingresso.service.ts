import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateIngressoDto } from './dto/create-ingresso.dto';
import { UpdateIngressoDto } from './dto/update-ingresso.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class IngressoService {
  constructor(private readonly prisma: PrismaService) { }

  // create(createIngressoDto: CreateIngressoDto) {
  //   return this.prisma.ingresso.create({
  //     data: createIngressoDto
  //   });
  // }

  findAll() {
    return this.prisma.ingresso.findMany();
  }

  findOne(id: string) {
    return this.prisma.ingresso.findUnique({
      where: { id }
    });
  }

  update(id: string, updateIngressoDto: UpdateIngressoDto) {
    return this.prisma.ingresso.update({
      where: { id },
      data: updateIngressoDto
    });
  }

  remove(id: string) {
    return this.prisma.ingresso.findUnique({
      where: { id },
      select: {
        id: true,
        pedidoId: true,
      },
    }).then((ingresso) => {
      if (!ingresso) {
        throw new NotFoundException(`Ingresso com ID ${id} não encontrado`);
      }

      return this.prisma.ingresso.delete({
        where: { id }
      });
    });
  }
}
