import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, Max } from 'class-validator';

export class CreateServicoDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do serviço é obrigatório.' })
  @Length(2, 100, { message: 'O nome do serviço deve ter entre 2 e 100 caracteres.' })
  nome: string;

  @IsOptional()
  @IsString()
  @Length(0, 500, { message: 'A descrição deve ter no máximo 500 caracteres.' })
  descricao?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'O preço padrão é obrigatório.' })
  @IsPositive({ message: 'O preço padrão deve ser maior que zero.' })
  @Max(100000, { message: 'O preço padrão não pode ser maior que R$ 100.000,00.' })
  precoPadrao: number;

  @IsInt()
  @IsNotEmpty({ message: 'A duração em minutos é obrigatória.' })
  @IsPositive({ message: 'A duração deve ser maior que zero.' })
  @Max(1440, { message: 'A duração não pode ser maior que 24 horas.' })
  duracaoMinutos: number;
}