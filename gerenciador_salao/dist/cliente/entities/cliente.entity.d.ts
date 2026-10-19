import { Cliente as PrismaCliente } from '@prisma/client';
export declare class Cliente implements PrismaCliente {
    id: string;
    nome: string;
    telefone: string;
    email: string | null;
    dataCadastro: Date;
    ativo: boolean;
}
