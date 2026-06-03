import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Nome completo do usuário', example: 'João da Silva' })
  @IsString({ message: 'Nome é obrigatório' })
  name!: string;

  @ApiProperty({ description: 'Email para cadastro', example: 'usuario@exemplo.com' })
  @IsEmail({}, { message: 'Informe um email válido' })
  email!: string;

  @ApiProperty({ description: 'Senha forte contendo pelo menos 8 caracteres (com letra maiúscula, minúscula, número e caractere especial)', example: 'Senha@1234' })
  @IsString({ message: 'Senha é obrigatória' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: 'A senha deve ter pelo menos 8 caracteres, com letra maiúscula, minúscula, número e símbolo',
    },
  )
  password!: string;
}