import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getResumo() {
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const inicioProximoMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 1);

    const [
      clientesAtivos,
      profissionaisAtivos,
      agendamentosMes,
      atendimentosMes,
      pagamentosMes,
      proximosAgendamentos,
      ultimosPagamentos,
    ] = await Promise.all([
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

    const faturamentoMes = pagamentosMes.reduce(
      (total, pagamento) => total + Number(pagamento.valorFinal),
      0,
    );
    const faturamentoDiario = pagamentosMes.reduce<Record<string, number>>((totais, pagamento) => {
      const dia = pagamento.dataPagamento.getDate().toString();
      totais[dia] = (totais[dia] ?? 0) + Number(pagamento.valorFinal);
      return totais;
    }, {});

    const servicosMap = new Map<string, { nome: string; quantidade: number }>();
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
}
