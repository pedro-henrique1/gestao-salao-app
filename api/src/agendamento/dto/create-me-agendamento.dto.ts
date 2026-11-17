import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateMeAgendamentoDto {
  @IsUUID('4', { message: 'O profissional deve ser um UUID válido.' })
  @IsNotEmpty()
  profissionalId: string;

  @IsUUID('4', { message: 'O serviço deve ser um UUID válido.' })
  @IsNotEmpty()
  servicoId: string;

  @IsDateString({}, { message: 'A data e hora devem estar no formato ISO.' })
  @IsNotEmpty()
  dataHoraReserva: string;
}
