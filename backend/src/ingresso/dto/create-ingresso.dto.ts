import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateIngressoDto {
    @ApiProperty({ description: 'Valor do ingresso inteira', example: 30.0 })
    @IsNumber()
    @IsNotEmpty()
    valorInteira: number;

    @ApiProperty({ description: 'Valor do ingresso meia', example: 15.0 })
    @IsNumber()
    @IsNotEmpty()
    valorMeia: number;

    @ApiProperty({ description: 'ID da sessão associada ao ingresso', example: 'uuid-sessao' })
    @IsString()
    @IsNotEmpty()
    sessaoId: string;
}
