import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @Length(2, 120, { message: 'O nome deve ter entre 2 e 120 caracteres.' })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'O telefone é obrigatório.' })
  @Matches(/^\d{10,11}$/, { message: 'O telefone deve conter DDD e entre 10 e 11 dígitos.' })
  telefone: string;

  @IsOptional()
  @IsEmail({}, { message: 'Formato de e-mail inválido.' })
  @Length(5, 160, { message: 'O e-mail deve ter entre 5 e 160 caracteres.' })
  email?: string;
}