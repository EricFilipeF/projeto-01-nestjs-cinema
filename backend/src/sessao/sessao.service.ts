import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessaoDto } from './dto/create-sessao.dto';
import { UpdateSessaoDto } from './dto/update-sessao.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessaoService {
  constructor(private readonly prisma: PrismaService) { }

  private calcularFimSessao(horario: string, duracaoFilme: number): Date {
    const inicio = new Date(horario);
    return new Date(inicio.getTime() + duracaoFilme * 60 * 1000);
  }

  private async validarConflitoSala(
    salaId: string,
    horario: string,
    filmeId: string,
    sessaoIdExcluir?: string,
  ) {
    const filme = await this.prisma.filme.findUnique({
      where: { id: filmeId },
      select: { duracao: true, titulo: true },
    });

    if (!filme) {
      throw new NotFoundException(`Filme com ID ${filmeId} não encontrado`);
    }

    const inicioNovaSessao = new Date(horario);
    const fimNovaSessao = this.calcularFimSessao(horario, filme.duracao);

    const sessoesDaSala = await this.prisma.sessao.findMany({
      where: {
        salaId,
        ...(sessaoIdExcluir ? { id: { not: sessaoIdExcluir } } : {}),
      },
      select: {
        id: true,
        horario: true,
        filme: {
          select: {
            duracao: true,
          },
        },
      },
    });

    const sessaoConflitante = sessoesDaSala.find((sessao) => {
      const inicioExistente = new Date(sessao.horario);
      const fimExistente = this.calcularFimSessao(sessao.horario, sessao.filme.duracao);

      return inicioNovaSessao < fimExistente && fimNovaSessao > inicioExistente;
    });

    if (sessaoConflitante) {
      throw new ConflictException('A sala selecionada já possui outra sessão agendada nesse horário.');
    }
  }

  private async validarSemIngressosVendidos(sessaoId: string) {
    const ingressosVendidos = await this.prisma.ingresso.count({
      where: { sessaoId },
    });

    if (ingressosVendidos > 0) {
      throw new ConflictException('Não é possível alterar ou excluir esta sessão pois já existem ingressos vendidos.');
    }
  }

  async create(createSessaoDto: CreateSessaoDto) {
    await this.validarConflitoSala(
      createSessaoDto.salaId,
      createSessaoDto.horario,
      createSessaoDto.filmeId,
    );

    return this.prisma.sessao.create({
      data: createSessaoDto,
    });
  }

  async findAll() {
    return this.prisma.sessao.findMany({
      include: {
        filme: true,
        sala: true,
      },
    });
  }

  async findOne(id: string) {
    const sessao = await this.prisma.sessao.findUnique({
      where: { id },
      include: {
        filme: true,
        sala: true,
      },
    });

    if (!sessao) {
      throw new NotFoundException(`Sessão com ID ${id} não encontrada`);
    }

    return sessao;
  }

  async update(id: string, updateSessaoDto: UpdateSessaoDto) {
    const sessaoExistente = await this.findOne(id); // Garante que a sessão existe antes de atualizar

    await this.validarSemIngressosVendidos(id);

    const salaId = updateSessaoDto.salaId ?? sessaoExistente.salaId;
    const horario = updateSessaoDto.horario ?? sessaoExistente.horario;
    const filmeId = updateSessaoDto.filmeId ?? sessaoExistente.filmeId;

    await this.validarConflitoSala(salaId, horario, filmeId, id);

    return this.prisma.sessao.update({
      where: { id },
      data: updateSessaoDto,
    });
  }

  async remove(id: string) {
    const sessao = await this.findOne(id);

    await this.validarSemIngressosVendidos(id);

    if (!sessao) {
      throw new NotFoundException(`Sessão com ID ${id} não encontrada`);
    }

    return this.prisma.sessao.delete({ where: { id } });
  }
}
