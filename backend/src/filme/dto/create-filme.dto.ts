import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, IsIn } from 'class-validator';

export class CreateFilmeDto {
    @ApiProperty({ description: 'Título do filme', example: 'Devoradores de Estrelas' })
    @IsString()
    @IsNotEmpty()
    titulo!: string;

    @ApiProperty({ description: 'Sinopse do filme', example: 'Devoradores de Estrelas acompanha a jornada inesquecível de um professor de ciências do ensino fundamental chamado Ryland Grace (Ryan Gosling)' })
    @IsString()
    @IsNotEmpty()
    sinopse!: string;

    @ApiProperty({ description: 'Gênero do filme', example: 'Ficção científica' })
    @IsString()
    @IsIn(['Ação', 'Comédia', 'Drama', 'Ficção científica', 'Terror'])
    genero!: string;

    @ApiProperty({ description: 'Classificação do filme', example: '14' })
    @IsString()
    @IsIn(['livre', '10', '12', '14', '16', '18'])
    classificacao!: string;

    @ApiProperty({ description: 'Duração do filme em minutos', example: 237 })
    @IsInt()
    @Min(1)
    @Max(500)
    duracao!: number;

    @ApiProperty({ description: 'Data de estreia do filme', example: '2026-03-19' })
    @IsString()
    @IsNotEmpty()
    dataEstreia!: string;

    @ApiProperty({ description: 'URL da imagem do filme', example: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/26d0428f-4fc8-4d49-b183-d4b2238f7dc6.__CR0,0,300,400_PT0_SX300_V1___.png' })
    @IsString()
    @IsNotEmpty()
    imagem!: string;
}
