import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'Nome é obrigatório' })
  name!: string;

  @IsEmail({}, { message: 'Informe um email válido' })
  email!: string;

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