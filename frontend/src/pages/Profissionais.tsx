import { useState } from 'react';
import { api } from '../api';
import { Toast } from '../components/Toast';
import { apenasDigitos, formatarTelefone } from '../utils/masks';

export function Profissionais() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null);

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);
    if (apenasDigitos(telefone).length < 10) {
      setMensagem({ tipo: 'erro', texto: 'Informe um telefone válido com DDD.' });
      return;
    }

    try {
      await api.post('/profissional', { nome: nome.trim(), telefone: apenasDigitos(telefone), especialidade: especialidade.trim() });
      setMensagem({ tipo: 'sucesso', texto: 'Profissional cadastrado com sucesso.' });
      setNome('');
      setTelefone('');
      setEspecialidade('');
    } catch (error: any) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao cadastrar profissional.' });
    }
  };

  return (
    <div className="card">
      <span className="page-eyebrow">Equipe do salão</span>
      <h2 className="card-title">Novo Profissional</h2>
      <p className="card-subtitle">Adicione profissionais e mantenha suas especialidades atualizadas.</p>
      
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
          <label>Nome do Profissional</label>
          <input 
            type="text" 
            className="input-field"
            placeholder="Ex: Carla Beauty" 
            value={nome} 
            onChange={e => setNome(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Telefone</label>
          <input 
            type="text" 
            className="input-field"
            placeholder="Ex: (11) 98888-8888" 
            value={telefone} 
            onChange={e => setTelefone(formatarTelefone(e.target.value))} 
            required 
            maxLength={15}
          />
        </div>

        <div className="form-group">
          <label>Especialidade</label>
          <input 
            type="text" 
            className="input-field"
            placeholder="Ex: Manicure, Cabeleireiro..." 
            value={especialidade} 
            onChange={e => setEspecialidade(e.target.value)} 
            required
          />
        </div>

        <button type="submit" className="btn">
          Cadastrar profissional
        </button>
      </form>
    </div>
  );
}