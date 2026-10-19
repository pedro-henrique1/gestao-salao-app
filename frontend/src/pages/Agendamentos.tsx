import { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import { Toast } from '../components/Toast';
import { dataFutura } from '../utils/masks';

export function Agendamentos() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);

  const [clienteId, setClienteId] = useState('');
  const [buscaCliente, setBuscaCliente] = useState('');
  const [clienteEmFoco, setClienteEmFoco] = useState(false);
  const [profissionalId, setProfissionalId] = useState('');
  const [buscaProfissional, setBuscaProfissional] = useState('');
  const [profissionalEmFoco, setProfissionalEmFoco] = useState(false);
  const [servicoId, setServicoId] = useState('');
  const [buscaServico, setBuscaServico] = useState('');
  const [servicoEmFoco, setServicoEmFoco] = useState(false);
  const [dataHoraReserva, setDataHoraReserva] = useState('');
  const [agendamentoParaCancelar, setAgendamentoParaCancelar] = useState<string | null>(null);
  const clienteRef = useRef<HTMLDivElement>(null);
  const profissionalRef = useRef<HTMLDivElement>(null);
  const servicoRef = useRef<HTMLDivElement>(null);
  
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null);

  const carregarAgendamentos = () => {
    api.get('/agendamento', { params: { status: 'PENDENTE' } }).then(res => setAgendamentos(res.data.items));
  };

  useEffect(() => {
    api.get('/cliente').then(res => setClientes(res.data.items));
    api.get('/profissional').then(res => setProfissionais(res.data.items));
    api.get('/servico').then(res => setServicos(res.data.items));
    carregarAgendamentos();
  }, []);

  useEffect(() => {
    const fecharListasAoClicarFora = (event: MouseEvent) => {
      const alvo = event.target as Node;
      if (!clienteRef.current?.contains(alvo)) setClienteEmFoco(false);
      if (!profissionalRef.current?.contains(alvo)) setProfissionalEmFoco(false);
      if (!servicoRef.current?.contains(alvo)) setServicoEmFoco(false);
    };

    document.addEventListener('mousedown', fecharListasAoClicarFora);
    return () => document.removeEventListener('mousedown', fecharListasAoClicarFora);
  }, []);

  const handleAgendar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);

    if (!clienteId || !profissionalId || !servicoId) {
      setMensagem({ tipo: 'erro', texto: 'Selecione cliente, profissional e serviço nas listas.' });
      return;
    }
    if (!dataFutura(dataHoraReserva)) {
      setMensagem({ tipo: 'erro', texto: 'Selecione uma data e horário futuros.' });
      return;
    }

    try {
      // O backend espera a data no formato ISO
      const dataIso = new Date(dataHoraReserva).toISOString();
      
      await api.post('/agendamento', {
        clienteId,
        profissionalId,
        servicoId,
        dataHoraReserva: dataIso
      });
      
      setMensagem({ tipo: 'sucesso', texto: 'Agendamento marcado com sucesso.' });
      setClienteId('');
      setBuscaCliente('');
      setClienteEmFoco(false);
      setProfissionalId('');
      setBuscaProfissional('');
      setProfissionalEmFoco(false);
      setServicoId('');
      setBuscaServico('');
      setServicoEmFoco(false);
      setDataHoraReserva('');
      carregarAgendamentos();
    } catch (error: any) {
      if (error.response?.status === 409) {
        setMensagem({ tipo: 'erro', texto: error.response.data.message });
      } else {
        setMensagem({ tipo: 'erro', texto: 'Erro ao realizar agendamento.' });
      }
    }
  };

  const clientesFiltrados = clientes.filter(cliente => {
    const termo = buscaCliente.toLowerCase();
    return cliente.nome.toLowerCase().includes(termo) || cliente.telefone.includes(termo);
  });

  const selecionarCliente = (cliente: any) => {
    setClienteId(cliente.id);
    setBuscaCliente(`${cliente.nome} (${cliente.telefone})`);
    setClienteEmFoco(false);
  };

  const profissionaisFiltrados = profissionais.filter(profissional => {
    const termo = buscaProfissional.toLowerCase();
    return profissional.nome.toLowerCase().includes(termo)
      || profissional.especialidade.toLowerCase().includes(termo);
  });

  const servicosFiltrados = servicos.filter(servico =>
    servico.nome.toLowerCase().includes(buscaServico.toLowerCase()),
  );

  const selecionarProfissional = (profissional: any) => {
    setProfissionalId(profissional.id);
    setBuscaProfissional(`${profissional.nome} - ${profissional.especialidade}`);
    setProfissionalEmFoco(false);
  };

  const selecionarServico = (servico: any) => {
    setServicoId(servico.id);
    setBuscaServico(`${servico.nome} (${servico.precoPadrao})`);
    setServicoEmFoco(false);
  };

  const handleCancelar = async (id: string) => {
    setAgendamentoParaCancelar(id);
  };

  const confirmarCancelamento = async () => {
    if (!agendamentoParaCancelar) return;
    setMensagem(null);
    try {
      await api.patch(`/agendamento/${agendamentoParaCancelar}/cancelar`);
      setMensagem({ tipo: 'sucesso', texto: 'Agendamento cancelado com sucesso.' });
      carregarAgendamentos();
    } catch (error: any) {
      setMensagem({ tipo: 'erro', texto: error.response?.data?.message || 'Erro ao cancelar agendamento.' });
    } finally {
      setAgendamentoParaCancelar(null);
    }
  };

  return (
    <div className="card">
      <span className="page-eyebrow">Agenda do salão</span>
      <h2 className="card-title">Novo Agendamento</h2>
      <p className="card-subtitle">Combine cliente, profissional e serviço para reservar um horário.</p>

      {mensagem?.tipo === 'sucesso' && (
        <Toast message={mensagem.texto} onClose={() => setMensagem(null)} />
      )}
      {mensagem?.tipo === 'erro' && (
        <div className={`feedback-msg ${mensagem.tipo === 'erro' ? 'feedback-error' : 'feedback-success'}`}>
          {mensagem.texto}
        </div>
      )}

      <form onSubmit={handleAgendar}>
        <div className="form-group">
          <label>Cliente</label>
          <div className="search-select" ref={clienteRef}>
            <input
              type="text"
              className="input-field"
              placeholder="Digite o nome ou telefone"
              value={buscaCliente}
              onFocus={() => {
                setClienteEmFoco(true);
                setClienteId('');
                setBuscaCliente('');
              }}
              onChange={event => {
                setBuscaCliente(event.target.value);
                setClienteId('');
              }}
              required
            />
            {clienteEmFoco && (
              <div className="search-results">
                {clientesFiltrados.length === 0 ? (
                  <span>Nenhum cliente encontrado.</span>
                ) : (
                  clientesFiltrados.map(cliente => (
                    <button type="button" key={cliente.id} onClick={() => selecionarCliente(cliente)}>
                      <strong>{cliente.nome}</strong>
                      <small>{cliente.telefone}</small>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Profissional</label>
          <div className="search-select" ref={profissionalRef}>
            <input
              type="text"
              className="input-field"
              placeholder="Digite o nome ou especialidade"
              value={buscaProfissional}
              onFocus={() => {
                setProfissionalEmFoco(true);
                setProfissionalId('');
                setBuscaProfissional('');
              }}
              onChange={event => {
                setBuscaProfissional(event.target.value);
                setProfissionalId('');
              }}
              required
            />
            {profissionalEmFoco && (
              <div className="search-results">
                {profissionaisFiltrados.length === 0 ? (
                  <span>Nenhum profissional encontrado.</span>
                ) : (
                  profissionaisFiltrados.map(profissional => (
                    <button type="button" key={profissional.id} onClick={() => selecionarProfissional(profissional)}>
                      <strong>{profissional.nome}</strong>
                      <small>{profissional.especialidade}</small>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Serviço</label>
          <div className="search-select" ref={servicoRef}>
            <input
              type="text"
              className="input-field"
              placeholder="Digite o nome do serviço"
              value={buscaServico}
              onFocus={() => {
                setServicoEmFoco(true);
                setServicoId('');
                setBuscaServico('');
              }}
              onChange={event => {
                setBuscaServico(event.target.value);
                setServicoId('');
              }}
              required
            />
            {servicoEmFoco && (
              <div className="search-results">
                {servicosFiltrados.length === 0 ? (
                  <span>Nenhum serviço encontrado.</span>
                ) : (
                  servicosFiltrados.map(servico => (
                    <button type="button" key={servico.id} onClick={() => selecionarServico(servico)}>
                      <strong>{servico.nome}</strong>
                      <small>R$ {servico.precoPadrao}</small>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Data e Hora</label>
          <input 
            type="datetime-local" 
            className="input-field"
            value={dataHoraReserva} 
            onChange={e => setDataHoraReserva(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" className="btn">Confirmar agendamento</button>
      </form>

      <section className="appointments-list">
        <h3>Agendamentos pendentes</h3>
        {agendamentos.length === 0 ? (
          <p className="empty-state">Nenhum agendamento pendente.</p>
        ) : (
          agendamentos.map(agendamento => (
            <div className="appointment-row" key={agendamento.id}>
              <div>
                <strong>{agendamento.cliente.nome}</strong>
                <span>{agendamento.servico.nome} com {agendamento.profissional.nome}</span>
                <span>{new Date(agendamento.dataHoraReserva).toLocaleString('pt-BR')}</span>
                <span className="status-badge status-pendente">Pendente</span>
              </div>
              <button type="button" className="cancel-button" onClick={() => handleCancelar(agendamento.id)}>
                Cancelar
              </button>
            </div>
          ))
        )}
      </section>

      {agendamentoParaCancelar && (
        <div className="modal-backdrop" role="presentation" onClick={() => setAgendamentoParaCancelar(null)}>
          <div className="confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="cancel-title" onClick={event => event.stopPropagation()}>
            <h3 id="cancel-title">Cancelar agendamento?</h3>
            <p>O horário será liberado para novos agendamentos.</p>
            <div className="modal-actions">
              <button type="button" className="modal-secondary" onClick={() => setAgendamentoParaCancelar(null)}>
                Voltar
              </button>
              <button type="button" className="modal-danger" onClick={confirmarCancelamento}>
                Cancelar agendamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}