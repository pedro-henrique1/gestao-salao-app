import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateProfissionalDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @Length(2, 120, { message: 'O nome deve ter entre 2 e 120 caracteres.' })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'O telefone é obrigatório.' })
  @Matches(/^\d{10,11}$/, { message: 'O telefone deve conter DDD e entre 10 e 11 dígitos.' })
  telefone: string;

  @IsString()
  @IsNotEmpty({ message: 'A especialidade é obrigatória.' })
  @Length(2, 80, { message: 'A especialidade deve ter entre 2 e 80 caracteres.' })
  especialidade: string;
}