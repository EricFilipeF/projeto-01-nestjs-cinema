import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, IsIn } from 'class-validator';

export class CreateFilmeDto {
    @ApiProperty({ description: 'Título do filme', example: 'O Poderoso Chefão' })
    @IsString()
    @IsNotEmpty()
    titulo: string;

    @ApiProperty({ description: 'Sinopse do filme', example: 'Um drama sobre uma família mafiosa' })
    @IsString()
    @IsNotEmpty()
    sinopse: string;

    @ApiProperty({ description: 'Gênero do filme', example: 'drama' })
    @IsString()
    @IsIn(['acao', 'comedia', 'drama', 'ficcao', 'terror'])
    genero: string;

    @ApiProperty({ description: 'Classificação do filme', example: '12' })
    @IsString()
    @IsIn(['livre', '10', '12', '14', '16', '18'])
    classificacao: string;

    @ApiProperty({ description: 'Duração do filme em minutos', example: 175 })
    @IsInt()
    @Min(1)
    @Max(500)
    duracao: number;

    @ApiProperty({ description: 'Data de estreia do filme', example: '2023-01-01' })
    @IsString()
    @IsNotEmpty()
    dataEstreia: string;

    @ApiProperty({ description: 'URL da imagem do filme', example: 'https://example.com/filme.jpg' })
    @IsString()
    @IsNotEmpty()
    imagem: string;
}
