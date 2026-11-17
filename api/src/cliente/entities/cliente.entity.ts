import { Cliente as PrismaCliente } from '@prisma/client';

export class Cliente implements PrismaCliente {
  id: string;
  nome: string;
  telefone: string;
  email: string | null; 
  usuarioId: string | null;
  dataCadastro: Date;
  ativo: boolean;
}