import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { UpdateFilmeDto } from './dto/update-filme.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FilmeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFilmeDto: CreateFilmeDto) {
    return this.prisma.filme.create({
      data: createFilmeDto,
    });
  }

  async findAll() {
    return this.prisma.filme.findMany();
  }

  async findOne(id: string) {
    const filme = await this.prisma.filme.findUnique({
      where: { id },
    });

    if (!filme) {
      throw new NotFoundException(`Filme com ID ${id} não encontrado`);
    }

    return filme;
  }

  async update(id: string, updateFilmeDto: UpdateFilmeDto) {
    await this.findOne(id);

    return this.prisma.filme.update({
      where: { id },
      data: updateFilmeDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.filme.delete({
      where: { id },
    });
  }
}
