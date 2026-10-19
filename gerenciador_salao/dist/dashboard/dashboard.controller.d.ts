import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
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
