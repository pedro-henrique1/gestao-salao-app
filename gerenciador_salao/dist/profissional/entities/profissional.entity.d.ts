import { Profissional as PrismaProfissional } from '@prisma/client';
export declare class Profissional implements PrismaProfissional {
    id: string;
    nome: string;
    telefone: string;
    especialidade: string;
    ativo: boolean;
    usuarioId: string | null;
}
