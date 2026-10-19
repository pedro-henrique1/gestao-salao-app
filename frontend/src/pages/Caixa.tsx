import { useState, useEffect } from 'react';
import { api } from '../api';
import { Toast } from '../components/Toast';
import { formatarMoedaInput, parseMoedaInput } from '../utils/masks';

export function Caixa() {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [atendimentos, setAtendimentos] = useState<any[]>([]);
  const [pagamentos, setPagamentos] = useState<any[]>([]);
  
  // States do UC04
  const [agendamentoId, setAgendamentoId] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [msgAtendimento, setMsgAtendimento] = useState<{ tipo: string, texto: string } | null>(null);

  // States do UC05
  const [atendimentoId, setAtendimentoId] = useState('');
  const [valorFinal, setValorFinal] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('PIX');
  const [msgPagamento, setMsgPagamento] = useState<{ tipo: string, texto: string } | null>(null);

  const carregarDados = () => {
    api.get('/agendamento', { params: { status: 'PENDENTE' } }).then(res => {
      const hoje = new Date();
      const agendamentosDeHoje = res.data.items.filter((agendamento: any) => {
        const dataAgendamento = new Date(agendamento.dataHoraReserva);
        return dataAgendamento.getFullYear() === hoje.getFullYear()
          && dataAgendamento.getMonth() === hoje.getMonth()
          && dataAgendamento.getDate() === hoje.getDate();
      });
      setAgendamentos(agendamentosDeHoje);
    });
    api.get('/atendimento', { params: { semPagamento: 'true' } }).then(res => setAtendimentos(res.data.items));
    api.get('/pagamento').then(res => setPagamentos(res.data.items));
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // --- UC04: Registrar Atendimento ---
  const handleAtendimento = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/atendimento', { agendamentoId, observacoes });
      setMsgAtendimento({ tipo: 'sucesso', texto: 'Atendimento registrado com sucesso.' });
      setAgendamentoId('');
      setObservacoes('');
      carregarDados();
    } catch (error: any) {
      setMsgAtendimento({ tipo: 'erro', texto: error.response?.data?.message || 'Erro ao registrar.' });
    }
  };

  const handlePagamento = async (e: React.FormEvent) => {
    e.preventDefault();
    const valor = parseMoedaInput(valorFinal);
    if (!valor) {
      setMsgPagamento({ tipo: 'erro', texto: 'Informe um valor maior que zero.' });
      return;
    }
    try {
      await api.post('/pagamento', { 
        atendimentoId, 
        valorFinal: valor,
        formaPagamento 
      });
      setMsgPagamento({ tipo: 'sucesso', texto: 'Pagamento recebido com sucesso.' });
      setAtendimentoId('');
      setValorFinal('');
      carregarDados();
    } catch (error: any) {
      setMsgPagamento({ tipo: 'erro', texto: error.response?.data?.message || 'Erro ao registrar pagamento.' });
    }
  };

  const handleSelecionarAtendimento = (id: string) => {
    setAtendimentoId(id);
    const atendimentoSelecionado = atendimentos.find(atendimento => atendimento.id === id);
    setValorFinal(formatarMoedaInput(Number(atendimentoSelecionado?.agendamento?.servico?.precoPadrao || 0)));
  };

  const handleSelecionarAgendamento = (id: string) => {
    setAgendamentoId(id);
  };

  const hoje = new Date();
  const totalDoDia = pagamentos.reduce((total, pagamento) => {
    const dataPagamento = new Date(pagamento.dataPagamento);
    const foiHoje = dataPagamento.getFullYear() === hoje.getFullYear()
      && dataPagamento.getMonth() === hoje.getMonth()
      && dataPagamento.getDate() === hoje.getDate();
    return foiHoje ? total + Number(pagamento.valorFinal) : total;
  }, 0);

  const formatarMoeda = (valor: number | string) => Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <div className="cashier-page">
      <div className="cashier-heading">
        <span className="page-eyebrow">Operação do salão</span>
        <h2>Caixa</h2>
        <p>Registre os serviços concluídos e acompanhe os recebimentos do dia.</p>
        <div className="daily-total">
          <span>Total recebido hoje</span>
          <strong>{totalDoDia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
        </div>
      </div>
      
      <div className="card cash-card attendance-card">
        <span className="cash-step">01 · Atendimento</span>
        <h2 className="card-title">Registrar atendimento</h2>
        <p className="card-subtitle">Dê baixa em um agendamento pendente.</p>
        
        {msgAtendimento?.tipo === 'sucesso' && (
          <Toast message={msgAtendimento.texto} onClose={() => setMsgAtendimento(null)} />
        )}
        {msgAtendimento?.tipo === 'erro' && (
          <div className={`feedback-msg ${msgAtendimento.tipo === 'erro' ? 'feedback-error' : 'feedback-success'}`}>
            {msgAtendimento.texto}
          </div>
        )}

        <form onSubmit={handleAtendimento}>
          <div className="form-group">
            <label>Selecione o Agendamento</label>
            <select className="input-field" value={agendamentoId} onChange={e => handleSelecionarAgendamento(e.target.value)} required>
              <option value="">Selecione...</option>
              {agendamentos.length === 0 && <option disabled>Nenhum atendimento disponível para hoje</option>}
              {agendamentos.map(ag => (
                <option key={ag.id} value={ag.id}>
                  {ag.cliente?.nome || 'Cliente'} · {ag.servico?.nome || 'Serviço'} · {new Date(ag.dataHoraReserva).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} · {formatarMoeda(ag.servico?.precoPadrao || 0)}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Observações do Serviço</label>
            <input type="text" className="input-field" value={observacoes} onChange={e => setObservacoes(e.target.value)} />
          </div>
          <button type="submit" className="btn">Registrar atendimento</button>
        </form>
      </div>

      <div className="card cash-card payment-card">
        <span className="cash-step">02 · Recebimento</span>
        <h2 className="card-title">Receber pagamento</h2>
        <p className="card-subtitle">Receba o pagamento de um atendimento já concluído.</p>
        {msgPagamento?.tipo === 'sucesso' && (
          <Toast message={msgPagamento.texto} onClose={() => setMsgPagamento(null)} />
        )}
        {msgPagamento?.tipo === 'erro' && (
          <div className={`feedback-msg ${msgPagamento.tipo === 'erro' ? 'feedback-error' : 'feedback-success'}`}>
            {msgPagamento.texto}
          </div>
        )}

        <form onSubmit={handlePagamento}>
          <div className="form-group">
            <label>Selecione o Atendimento</label>
            <select className="input-field" value={atendimentoId} onChange={e => handleSelecionarAtendimento(e.target.value)} required>
              <option value="">Selecione...</option>
              {atendimentos.length === 0 && <option disabled>Nenhum atendimento aguardando pagamento</option>}
              {atendimentos.map(at => (
                <option key={at.id} value={at.id}>
                  {at.agendamento?.cliente?.nome || 'Cliente'} · {at.agendamento?.servico?.nome || 'Serviço'} · {formatarMoeda(at.agendamento?.servico?.precoPadrao || 0)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Valor Final (R$)</label>
            <input type="text" inputMode="numeric" className="input-field" placeholder="R$ 0,00" value={valorFinal} onChange={e => setValorFinal(formatarMoedaInput(e.target.value))} required />
          </div>

          <div className="form-group">
            <label>Forma de Pagamento</label>
            <select className="input-field" value={formaPagamento} onChange={e => setFormaPagamento(e.target.value)} required>
              <option value="PIX">PIX</option>
              <option value="CARTAO">Cartão</option>
              <option value="DINHEIRO">Dinheiro</option>
            </select>
          </div>

          <button type="submit" className="btn payment-submit">Registrar recebimento</button>
        </form>
      </div>

    </div>
  );
}