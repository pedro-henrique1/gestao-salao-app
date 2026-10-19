import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Formato de e-mail inválido.' })
  @MaxLength(160, { message: 'O e-mail deve ter no máximo 160 caracteres.' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(72, { message: 'A senha deve ter no máximo 72 caracteres.' })
  senha: string;
}