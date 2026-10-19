"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getResumo() {
        const agora = new Date();
        const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
        const inicioProximoMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 1);
        const [clientesAtivos, profissionaisAtivos, agendamentosMes, atendimentosMes, pagamentosMes, proximosAgendamentos, ultimosPagamentos,] = await Promise.all([
            this.prisma.cliente.count({ where: { ativo: true } }),
            this.prisma.profissional.count({ where: { ativo: true } }),
            this.prisma.agendamento.count({
                where: { dataHoraReserva: { gte: inicioMes, lt: inicioProximoMes } },
            }),
            this.prisma.atendimento.count({
                where: { dataConclusao: { gte: inicioMes, lt: inicioProximoMes } },
            }),
            this.prisma.pagamento.findMany({
                where: { dataPagamento: { gte: inicioMes, lt: inicioProximoMes } },
                select: { valorFinal: true, dataPagamento: true },
            }),
            this.prisma.agendamento.findMany({
                where: { status: 'PENDENTE', dataHoraReserva: { gte: agora } },
                orderBy: { dataHoraReserva: 'asc' },
                take: 5,
                include: { cliente: true, profissional: true, servico: true },
            }),
            this.prisma.pagamento.findMany({
                orderBy: { dataPagamento: 'desc' },
                take: 5,
                include: {
                    atendimento: {
                        include: {
                            agendamento: { include: { cliente: true, servico: true } },
                        },
                    },
                },
            }),
        ]);
        const faturamentoMes = pagamentosMes.reduce((total, pagamento) => total + Number(pagamento.valorFinal), 0);
        const faturamentoDiario = pagamentosMes.reduce((totais, pagamento) => {
            const dia = pagamento.dataPagamento.getDate().toString();
            totais[dia] = (totais[dia] ?? 0) + Number(pagamento.valorFinal);
            return totais;
        }, {});
        const servicosMap = new Map();
        const atendimentosComServico = await this.prisma.atendimento.findMany({
            where: { dataConclusao: { gte: inicioMes, lt: inicioProximoMes } },
            select: { agendamento: { select: { servico: { select: { nome: true } } } } },
        });
        atendimentosComServico.forEach(({ agendamento }) => {
            const atual = servicosMap.get(agendamento.servico.nome);
            servicosMap.set(agendamento.servico.nome, {
                nome: agendamento.servico.nome,
                quantidade: (atual?.quantidade ?? 0) + 1,
            });
        });
        return {
            periodo: { inicio: inicioMes, fim: inicioProximoMes },
            indicadores: {
                clientesAtivos,
                profissionaisAtivos,
                agendamentosMes,
                atendimentosMes,
                faturamentoMes,
            },
            faturamentoDiario: Object.entries(faturamentoDiario).map(([dia, valor]) => ({
                dia: Number(dia),
                valor,
            })).sort((a, b) => a.dia - b.dia),
            servicosMaisRealizados: [...servicosMap.values()]
                .sort((a, b) => b.quantidade - a.quantidade)
                .slice(0, 5),
            proximosAgendamentos,
            ultimosPagamentos,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map