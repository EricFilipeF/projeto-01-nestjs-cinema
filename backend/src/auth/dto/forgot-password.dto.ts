import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ description: 'Email do usuário para recuperação de senha', example: 'usuario@exemplo.com' })
  @IsEmail({}, { message: 'Informe um email válido' })
  email!: string;
}