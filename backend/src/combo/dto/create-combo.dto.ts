

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateComboDto {
    @ApiProperty({ description: 'Nome do combo/lanche', example: 'Combo Pipoca Grande' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nome!: string;

    @ApiProperty({ description: 'Descrição detalhada do combo', example: 'Pipoca grande salgada e 2 refrigerantes 500ml' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(300)
    descricao!: string;

    @ApiProperty({ description: 'Preço do combo', example: 35.5 })
    @IsNumber()
    @Min(0.01)
    preco!: number;

    @ApiProperty({ description: 'Quantidade de combos no pedido', example: 2, required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    quantidade?: number;
}
