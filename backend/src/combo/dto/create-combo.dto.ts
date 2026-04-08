

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateComboDto {
    @ApiProperty({ description: 'Nome do combo/lanche', example: 'Refri + Pipoca' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nome!: string;

    @ApiProperty({ description: 'Descrição detalhada do combo', example: 'Pipoca grande salgada e 1 refrigerante 500ml' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(300)
    descricao!: string;

    @ApiProperty({ description: 'Preço do combo', example: 38.50 })
    @IsNumber()
    @Min(0.01)
    preco!: number;
}
