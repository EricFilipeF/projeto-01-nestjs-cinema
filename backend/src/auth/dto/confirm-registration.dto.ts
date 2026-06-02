import { IsEmail, IsString, Length } from 'class-validator';

export class ConfirmRegistrationDto {
  @IsEmail({}, { message: 'Informe um email válido' })
  email!: string;

  @IsString({ message: 'O código de confirmação é obrigatório' })
  @Length(6, 6, { message: 'O código de confirmação deve ter 6 dígitos' })
  code!: string;
}