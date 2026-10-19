import { useEffect, useState } from 'react';
import { api } from '../api';

type DashboardData = {
  indicadores: {
    clientesAtivos: number;
    profissionaisAtivos: number;
    agendamentosMes: number;
    atendimentosMes: number;
    faturamentoMes: number;
  };
  servicosMaisRealizados: { nome: string; quantidade: number }[];
  faturamentoDiario: { dia: number; valor: number }[];
  proximosAgendamentos: any[];
  ultimosPagamentos: any[];
};

const moeda = (valor: number | string) => Number(valor).toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function Dashboard() {
  const [dados, setDados] = useState<DashboardData | null>(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setDados(res.data))
      .catch(error => setErro(
        error.response?.status === 403
          ? 'A dashboard está disponível apenas para usuários gerentes.'
          : 'Não foi possível carregar os indicadores.',
      ));
  }, []);

  if (erro) return <div className="feedback-msg feedback-error">{erro}</div>;
  if (!dados) return <p className="dashboard-loading">Carregando indicadores...</p>;

  const { indicadores } = dados;
  const maiorQuantidade = Math.max(...dados.servicosMaisRealizados.map(servico => servico.quantidade), 1);
  const maiorFaturamento = Math.max(...dados.faturamentoDiario.map(item => item.valor), 1);

  return (
    <div className="dashboard-page">
      <div className="dashboard-heading">
        <span className="page-eyebrow">Visão gerencial</span>
        <h2>Dashboard</h2>
        <p>Acompanhe os principais indicadores do salão neste mês.</p>
      </div>

      <section className="dashboard-metrics">
        <div className="dashboard-metric"><span>Faturamento no mês</span><strong>{moeda(indicadores.faturamentoMes)}</strong></div>
        <div className="dashboard-metric"><span>Atendimentos realizados</span><strong>{indicadores.atendimentosMes}</strong></div>
        <div className="dashboard-metric"><span>Agendamentos no mês</span><strong>{indicadores.agendamentosMes}</strong></div>
        <div className="dashboard-metric"><span>Clientes ativos</span><strong>{indicadores.clientesAtivos}</strong></div>
      </section>

      <div className="dashboard-panels">
        <section className="dashboard-panel">
          <span className="page-eyebrow">Agenda</span>
          <h3>Próximos agendamentos</h3>
          {dados.proximosAgendamentos.length === 0 ? <p className="empty-state">Nenhum agendamento próximo.</p> : (
            <div className="dashboard-list">
              {dados.proximosAgendamentos.map(agendamento => (
                <div className="dashboard-list-item" key={agendamento.id}>
                  <div><strong>{agendamento.cliente.nome}</strong><span>{agendamento.servico.nome} · {agendamento.profissional.nome}</span></div>
                  <time>{new Date(agendamento.dataHoraReserva).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</time>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-panel">
          <span className="page-eyebrow">Faturamento</span>
          <h3>Evolução diária</h3>
          {dados.faturamentoDiario.length === 0 ? <div className="chart-empty">Nenhum pagamento registrado neste mês.</div> : (
            <div className="revenue-chart" aria-label="Gráfico de faturamento diário">
              <div className="revenue-bars">
                {dados.faturamentoDiario.map(item => (
                  <div className="revenue-bar-wrapper" key={item.dia} title={`${item.dia} - ${moeda(item.valor)}`}>
                    <div className="revenue-bar" style={{ height: `${Math.max((item.valor / maiorFaturamento) * 100, 5)}%` }} />
                    <span>{item.dia}</span>
                  </div>
                ))}
              </div>
              <div className="chart-caption"><span>Dia do mês</span><strong>{moeda(indicadores.faturamentoMes)}</strong></div>
            </div>
          )}
        </section>

        <section className="dashboard-panel">
          <span className="page-eyebrow">Desempenho</span>
          <h3>Serviços mais realizados</h3>
          {dados.servicosMaisRealizados.length === 0 ? <div className="chart-empty">Nenhum atendimento registrado neste mês.</div> : (
            <div className="dashboard-list">
              {dados.servicosMaisRealizados.map(servico => (
                <div className="service-chart-item" key={servico.nome}>
                  <div className="service-chart-label"><strong>{servico.nome}</strong><span>{servico.quantidade}</span></div>
                  <div className="service-chart-track"><div className="service-chart-bar" style={{ width: `${(servico.quantidade / maiorQuantidade) * 100}%` }} /></div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-panel dashboard-panel-wide">
          <span className="page-eyebrow">Financeiro</span>
          <h3>Últimos pagamentos</h3>
          {dados.ultimosPagamentos.length === 0 ? <p className="empty-state">Nenhum pagamento registrado.</p> : (
            <div className="dashboard-list">
              {dados.ultimosPagamentos.map(pagamento => (
                <div className="dashboard-list-item" key={pagamento.id}>
                  <div><strong>{pagamento.atendimento.agendamento.cliente.nome}</strong><span>{pagamento.atendimento.agendamento.servico.nome} · {pagamento.formaPagamento}</span></div>
                  <strong>{moeda(pagamento.valorFinal)}</strong>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
