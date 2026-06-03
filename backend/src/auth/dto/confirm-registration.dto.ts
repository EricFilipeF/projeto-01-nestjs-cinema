import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class ConfirmRegistrationDto {
  @ApiProperty({ description: 'Email do usuário registrado', example: 'usuario@exemplo.com' })
  @IsEmail({}, { message: 'Informe um email válido' })
  email!: string;

  @ApiProperty({ description: 'Código de confirmação de 6 dígitos enviado por e-mail', example: '123456' })
  @IsString({ message: 'O código de confirmação é obrigatório' })
  @Length(6, 6, { message: 'O código de confirmação deve ter 6 dígitos' })
  code!: string;
}