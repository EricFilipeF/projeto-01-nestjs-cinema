import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Código/Token de redefinição de senha enviado por e-mail', example: '123456' })
  @IsString({ message: 'O código de recuperação é obrigatório' })
  token!: string;

  @ApiProperty({ description: 'Nova senha contendo pelo menos 8 caracteres (com letra maiúscula, minúscula, número e caractere especial)', example: 'NovaSenha@123' })
  @IsString({ message: 'A nova senha é obrigatória' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: 'A nova senha deve ter pelo menos 8 caracteres, com letra maiúscula, minúscula, número e símbolo',
    },
  )
  password!: string;
}