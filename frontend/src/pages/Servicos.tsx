import { useState } from 'react';
import { api } from '../api';
import { Toast } from '../components/Toast';
import { apenasDigitos, formatarMoedaInput, parseMoedaInput } from '../utils/masks';

export function Servicos() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [precoPadrao, setPrecoPadrao] = useState('');
  const [duracaoMinutos, setDuracaoMinutos] = useState('');
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null);

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);
    const preco = parseMoedaInput(precoPadrao);
    const duracao = parseInt(duracaoMinutos, 10);
    if (!preco) {
      setMensagem({ tipo: 'erro', texto: 'Informe um preço maior que zero.' });
      return;
    }
    if (!duracao || duracao < 1 || duracao > 1440) {
      setMensagem({ tipo: 'erro', texto: 'A duração deve estar entre 1 e 1440 minutos.' });
      return;
    }

    try {
      await api.post('/servico', { 
        nome: nome.trim(), 
        descricao, 
        precoPadrao: preco,
        duracaoMinutos: duracao
      });
      setMensagem({ tipo: 'sucesso', texto: 'Serviço cadastrado com sucesso.' });
      setNome(''); setDescricao(''); setPrecoPadrao(''); setDuracaoMinutos('');
    } catch (error: any) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao cadastrar serviço.' });
    }
  };

  return (
    <div className="card">
      <span className="page-eyebrow">Catálogo do salão</span>
      <h2 className="card-title">Novo Serviço</h2>
      <p className="card-subtitle">Defina os serviços, preços e duração usados nos agendamentos.</p>
      
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
          <label>Nome do Serviço</label>
          <input type="text" className="input-field" maxLength={100} placeholder="Ex: Manutenção de gel" value={nome} onChange={e => setNome(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Descrição (Opcional)</label>
          <input type="text" className="input-field" maxLength={500} value={descricao} onChange={e => setDescricao(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Preço Padrão (R$)</label>
          <input type="text" inputMode="numeric" className="input-field" placeholder="Ex: R$ 80,00" value={precoPadrao} onChange={e => setPrecoPadrao(formatarMoedaInput(e.target.value))} required />
        </div>

        <div className="form-group">
          <label>Duração (Em minutos)</label>
          <input type="text" inputMode="numeric" className="input-field" placeholder="Ex: 60" value={duracaoMinutos} onChange={e => setDuracaoMinutos(apenasDigitos(e.target.value))} required />
        </div>

        <button type="submit" className="btn">
          Cadastrar serviço
        </button>
      </form>
    </div>
  );
}