import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SalaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSalaDto: CreateSalaDto) {
    return this.prisma.sala.create({
      data: createSalaDto,
    });
  }

  async findAll() {
    return this.prisma.sala.findMany();
  }

  async findOne(id: string) {
    const sala = await this.prisma.sala.findUnique({
      where: { id },
    });

    if (!sala) {
      throw new NotFoundException(`Sala com ID ${id} não encontrada`);
    }

    return sala;
  }

  async update(id: string, updateSalaDto: UpdateSalaDto) {
    await this.findOne(id); // Verifica se existe

    return this.prisma.sala.update({
      where: { id },
      data: updateSalaDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Verifica se existe

    return this.prisma.sala.delete({
      where: { id },
    });
  }
}
