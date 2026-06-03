import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Email cadastrado', example: 'usuario@exemplo.com' })
  @IsEmail({}, { message: 'Informe um email válido' })
  email!: string;

  @ApiProperty({ description: 'Senha de acesso', example: '123456' })
  @IsString({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password!: string;
}