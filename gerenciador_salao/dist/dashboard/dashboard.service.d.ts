import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getResumo(): Promise<{
        periodo: {
            inicio: Date;
            fim: Date;
        };
        indicadores: {
            clientesAtivos: any;
            profissionaisAtivos: any;
            agendamentosMes: any;
            atendimentosMes: any;
            faturamentoMes: any;
        };
        faturamentoDiario: {
            dia: number;
            valor: unknown;
        }[];
        servicosMaisRealizados: {
            nome: string;
            quantidade: number;
        }[];
        proximosAgendamentos: any;
        ultimosPagamentos: any;
    }>;
}
