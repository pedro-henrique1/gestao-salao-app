import { useEffect, useState } from 'react';
import { api } from '../api';
import { Toast } from '../components/Toast';
import { apenasDigitos, emailValido, formatarTelefone } from '../utils/masks';

export function Clientes() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [clientes, setClientes] = useState<any[]>([]);
  const [busca, setBusca] = useState('');
  const [clienteEditando, setClienteEditando] = useState<string | null>(null);
  const [historico, setHistorico] = useState<any | null>(null);
  
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null);

  const carregarClientes = () => {
    api.get('/cliente', { params: busca ? { nome: busca } : {} })
      .then(res => setClientes(res.data.items));
  };

  useEffect(() => {
    carregarClientes();
  }, [busca]);

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null); 
    if (email && !emailValido(email)) {
      setMensagem({ tipo: 'erro', texto: 'Informe um e-mail válido.' });
      return;
    }
    if (apenasDigitos(telefone).length < 10) {
      setMensagem({ tipo: 'erro', texto: 'Informe um telefone válido com DDD.' });
      return;
    }

    try {
      const dados = { nome: nome.trim(), telefone: apenasDigitos(telefone), email: email.trim() || undefined };
      if (clienteEditando) {
        await api.patch(`/cliente/${clienteEditando}`, dados);
        setMensagem({ tipo: 'sucesso', texto: 'Dados do cliente atualizados.' });
      } else {
        await api.post('/cliente', dados);
        setMensagem({ tipo: 'sucesso', texto: 'Cliente cadastrado com sucesso.' });
      }
      setNome('');
      setTelefone('');
      setEmail('');
      setClienteEditando(null);
      carregarClientes();
    } catch (error: any) {
      if (error.response?.status === 409) {
        setMensagem({ tipo: 'erro', texto: error.response.data.message });
      } else {
        setMensagem({ tipo: 'erro', texto: 'Erro inesperado ao conectar com o servidor.' });
      }
    }
  };

  const editarCliente = (cliente: any) => {
    setClienteEditando(cliente.id);
    setNome(cliente.nome);
    setTelefone(formatarTelefone(cliente.telefone));
    setEmail(cliente.email || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicao = () => {
    setClienteEditando(null);
    setNome('');
    setTelefone('');
    setEmail('');
  };

  const abrirHistorico = async (id: string) => {
    try {
      const response = await api.get(`/cliente/${id}`);
      setHistorico(response.data);
    } catch {
      setMensagem({ tipo: 'erro', texto: 'Não foi possível carregar o histórico do cliente.' });
    }
  };

  const inativarCliente = async (cliente: any) => {
    if (!window.confirm(`Inativar o cliente ${cliente.nome}? Ele não poderá receber novos agendamentos.`)) {
      return;
    }

    try {
      await api.patch(`/cliente/${cliente.id}/inativar`);
      setMensagem({ tipo: 'sucesso', texto: 'Cliente inativado com sucesso.' });
      if (clienteEditando === cliente.id) {
        cancelarEdicao();
      }
      carregarClientes();
    } catch {
      setMensagem({ tipo: 'erro', texto: 'Não foi possível inativar o cliente.' });
    }
  };

  return (
    <div className="client-page">
      <div className="card client-form-card">
      <span className="page-eyebrow">Cadastro</span>
      <h2 className="card-title">{clienteEditando ? 'Editar cliente' : 'Novo cliente'}</h2>
      <p className="card-subtitle">Mantenha os dados dos clientes organizados para agilizar os agendamentos.</p>
      
      {mensagem?.tipo === 'sucesso' && (
        <Toast message={mensagem.texto} onClose={() => setMensagem(null)} />
      )}
      {mensagem?.tipo === 'erro' && (
        <div className={`feedback-msg ${mensagem.tipo === 'erro' ? 'feedback-error' : 'feedback-success'}`}>
          {mensagem.texto}
        </div>
      )}

      <form onSubmit={handleCadastrar}>
        <div className="form-group">
          <label>Nome Completo</label>
          <input 
            type="text" 
            className="input-field"
            placeholder="Ex: Ana Lúcia" 
            value={nome} 
            onChange={e => setNome(e.target.value)} 
            required 
            maxLength={120}
          />
        </div>

        <div className="form-group">
          <label>Telefone (WhatsApp)</label>
          <input 
            type="text" 
            className="input-field"
            placeholder="Ex: (11) 99999-9999" 
            value={telefone} 
            onChange={e => setTelefone(formatarTelefone(e.target.value))} 
            required 
            maxLength={15}
          />
        </div>

        <div className="form-group">
          <label>E-mail (Opcional)</label>
          <input 
            type="email"
            className="input-field"
            placeholder="Ex: ana@email.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            maxLength={160}
          />
        </div>

        <button type="submit" className="btn">
          {clienteEditando ? 'Salvar alterações' : 'Cadastrar cliente'}
        </button>
        {clienteEditando && (
          <button type="button" className="secondary-btn" onClick={cancelarEdicao}>
            Cancelar edição
          </button>
        )}
      </form>
      </div>

      <section className="client-list-section">
        <div className="section-heading">
          <div>
            <span className="page-eyebrow">Base de clientes</span>
            <h2 className="card-title">Clientes cadastrados</h2>
          </div>
          <span className="list-count">{clientes.length} encontrados</span>
        </div>
        <input className="input-field client-search" placeholder="Buscar por nome" value={busca} onChange={e => setBusca(e.target.value)} />
        {clientes.length === 0 ? (
          <p className="empty-state">Nenhum cliente encontrado.</p>
        ) : (
          <div className="client-list">
            {clientes.map(cliente => (
              <div className="client-row" key={cliente.id}>
                <div>
                  <strong>{cliente.nome}</strong>
                  <span>{cliente.telefone}{cliente.email ? ` · ${cliente.email}` : ''}</span>
                </div>
                <div className="client-actions">
                  <button type="button" className="text-action" onClick={() => abrirHistorico(cliente.id)}>Histórico</button>
                  <button type="button" className="text-action" onClick={() => editarCliente(cliente)}>Editar</button>
                  <button type="button" className="text-action danger-action" onClick={() => inativarCliente(cliente)}>Inativar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {historico && (
        <div className="modal-backdrop" role="presentation" onClick={() => setHistorico(null)}>
          <div className="confirmation-modal client-history-modal" role="dialog" aria-modal="true" aria-labelledby="history-title" onClick={event => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setHistorico(null)} aria-label="Fechar histórico">Fechar</button>
            <span className="page-eyebrow">Histórico do cliente</span>
            <h3 id="history-title">{historico.nome}</h3>
            <p>{historico.telefone}{historico.email ? ` · ${historico.email}` : ''}</p>
            {historico.agendamentos?.length ? historico.agendamentos.map((agendamento: any) => (
              <div className="history-item" key={agendamento.id}>
                <strong>{agendamento.servico.nome}</strong>
                <span>{new Date(agendamento.dataHoraReserva).toLocaleDateString('pt-BR')} · {agendamento.status}</span>
              </div>
            )) : <p className="empty-state">Nenhum serviço registrado para este cliente.</p>}
          </div>
        </div>
      )}
    </div>
  );
}