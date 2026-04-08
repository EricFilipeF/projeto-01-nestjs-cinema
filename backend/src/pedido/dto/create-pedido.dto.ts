import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { IsInt, IsUUID, Min } from "class-validator";
import { CreateIngressoDto } from "src/ingresso/dto/create-ingresso.dto";

export class CreateLanchePedidoDto {
    @ApiProperty({ description: 'ID do combo no catálogo', example: 'uuid-do-combo' })
    @IsUUID()
    lancheComboId!: string;

    @ApiProperty({ description: 'Quantidade do combo no pedido', example: 2 })
    @IsInt()
    @Min(1)
    quantidade!: number;
}

export class CreatePedidoDto {
    @ApiProperty({ description: 'Quantidade de ingressos inteiros', example: 1 })
    @IsInt()
    quantidadeInteira!: number;

    @ApiProperty({ description: 'Quantidade de ingressos meia', example: 1 })
    @IsInt()
    quantidadeMeia!: number;

    @ApiProperty({
        description: 'Lista de ingressos',
        example: [
            {
                valorInteira: 30,
                valorMeia: 15,
                sessaoId: 'uuid',
            },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateIngressoDto)
    ingresso!: CreateIngressoDto[];

    @ApiProperty({
        description: 'Lista de lanches do pedido',
        example: [
            {
                lancheComboId: 'uuid',
                quantidade: 1,
            },
        ],
    })
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateLanchePedidoDto)
    lanchePedido?: CreateLanchePedidoDto[];

}
