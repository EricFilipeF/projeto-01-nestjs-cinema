import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, IsUUID } from 'class-validator';

export class CreateSessaoDto {
  @ApiProperty({ description: 'Horário da sessão', example: '20:00' })
  @IsString()
  @IsNotEmpty()
  horario: string;

  @ApiProperty({ description: 'Valor do ingresso', example: 15.5 })
  @IsNumber()
  @Min(0.01)
  valorIngresso: number;

  @ApiProperty({ description: 'Ingressos vendidos', example: 50 })
  @IsInt()
  @Min(0)
  @IsOptional()
  ingressosVendidos?: number;

  @IsString()
  @IsNotEmpty()
  filmeId: string;

  @ApiProperty({ description: 'ID da sala', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  salaId: string;

  @ApiProperty({ description: 'Tipo de Projeção', example: '3d' })
  @IsString()
  @IsNotEmpty()
  tipoProjecao: string;
}
