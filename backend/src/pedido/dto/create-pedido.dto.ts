import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { IsInt } from "class-validator";
import { CreateComboDto } from "src/combo/dto/create-combo.dto";
import { CreateIngressoDto } from "src/ingresso/dto/create-ingresso.dto";

export class CreatePedidoDto {
    @ApiProperty({ description: 'Quantidade de ingressos inteiros', example: 2 })
    @IsInt()
    quantidadeInteira!: number;

    @ApiProperty({ description: 'Quantidade de ingressos meia', example: 1 })
    @IsInt()
    quantidadeMeia!: number;

    @ApiProperty({ description: 'Lista de ingressos', example: [] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateIngressoDto)
    ingresso!: CreateIngressoDto[];

    @ApiProperty({ description: 'Lista de lanches combos', example: [] })
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateComboDto)
    lancheCombo?: CreateComboDto[];

}
