import { NivelAcesso } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsEmail({}, { message: 'Formato de e-mail inválido.' })
  @MaxLength(160, { message: 'O e-mail deve ter no máximo 160 caracteres.' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
  @MaxLength(72, { message: 'A senha deve ter no máximo 72 caracteres.' })
  @IsNotEmpty()
  senha: string;

  @IsOptional()
  @IsEnum(NivelAcesso, { message: 'Perfil de acesso inválido.' })
  nivelAcesso?: NivelAcesso;

  @IsOptional()
  @IsString()
  @Length(2, 120, { message: 'O nome deve ter entre 2 e 120 caracteres.' })
  nome?: string;

  @IsOptional()
  @Matches(/^\d{10,11}$/, { message: 'O telefone deve conter DDD e entre 10 e 11 dígitos.' })
  telefone?: string;
}