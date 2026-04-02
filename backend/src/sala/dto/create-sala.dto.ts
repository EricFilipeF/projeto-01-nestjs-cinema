import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsString, Max, Min, Length } from 'class-validator';

export class CreateSalaDto {
  @ApiProperty({ description: 'Nome da sala', example: 'Sala 1' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  nome: string;

  @ApiProperty({ description: 'Capacidade da sala', example: 100 })
  @IsInt()
  @Min(1)
  @Max(1000)
  capacidade: number;
}
