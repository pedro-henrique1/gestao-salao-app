import { FormaPagamento } from '@prisma/client';
export declare class CreatePagamentoDto {
    atendimentoId: string;
    valorFinal: number;
    formaPagamento: FormaPagamento;
}
