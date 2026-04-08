import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString, Min, IsUUID } from 'class-validator';

export class CreateSessaoDto {
  @ApiProperty({ description: 'Data e horário da sessão', example: '2026-04-15:20:00' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  horario!: Date;

  @ApiProperty({ description: 'Valor do ingresso', example: 36 })
  @IsNumber()
  @Min(0.01)
  valorIngresso!: number;

  @ApiProperty({ description: 'Tipo de Projeção', example: '3d' })
  @IsString()
  @IsNotEmpty()
  tipoProjecao!: string;

  @ApiProperty({ description: 'ID do filme', example: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  filmeId!: string;

  @ApiProperty({ description: 'ID da sala', example: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  salaId!: string;
}
