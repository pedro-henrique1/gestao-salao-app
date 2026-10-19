import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Toast } from '../components/Toast';
import { emailValido } from '../utils/masks';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isRegistro, setIsRegistro] = useState(false); 
  const [mensagem, setMensagem] = useState<{ tipo: string, texto: string } | null>(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);
    if (!emailValido(email)) {
      setMensagem({ tipo: 'erro', texto: 'Informe um e-mail válido.' });
      return;
    }
    if (isRegistro && senha.length < 8) {
      setMensagem({ tipo: 'erro', texto: 'A senha deve ter pelo menos 8 caracteres.' });
      return;
    }

    try {
      if (isRegistro) {
        await api.post('/auth/registro', { email, senha });
        setMensagem({ tipo: 'sucesso', texto: 'Conta criada. Agora faça o login.' });
        setIsRegistro(false); 
        setSenha('');
      } else {
        const response = await api.post('/auth/login', { email, senha });
        
        const token = response.data.accessToken || response.data.access_token || response.data.token;
        
        localStorage.setItem('token', token);
        
        navigate('/');
      }
    } catch (error: any) {
      setMensagem({ tipo: 'erro', texto: error.response?.data?.message || 'Erro ao autenticar. Verifique suas credenciais.' });
    }
  };

  return (
    <div className="auth-layout">
      <section className="auth-intro">
        <span className="auth-brand-mark">GS</span>
        <span className="page-eyebrow">Gestão de Salão</span>
        <h1>Seu salão,<br />mais organizado.</h1>
        <p>Agende horários, acompanhe sua equipe e mantenha cada atendimento sob controle.</p>
      </section>

      <div className="card auth-card">
        <span className="page-eyebrow">Área restrita</span>
        <h2 className="card-title">
          {isRegistro ? 'Criar conta' : 'Acesso ao sistema'}
        </h2>
        <p className="card-subtitle">
          {isRegistro ? 'Cadastre-se para acessar o painel do salão.' : 'Insira suas credenciais para continuar.'}
        </p>

        {mensagem?.tipo === 'sucesso' && (
          <Toast message={mensagem.texto} onClose={() => setMensagem(null)} />
        )}
        {mensagem?.tipo === 'erro' && (
          <div className={`feedback-msg ${mensagem.tipo === 'erro' ? 'feedback-error' : 'feedback-success'}`}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-mail</label>
            <input 
              type="email" 
              className="input-field" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              maxLength={160}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Senha</label>
            <input 
              type="password" 
              className="input-field" 
              value={senha} 
              onChange={e => setSenha(e.target.value)} 
              minLength={isRegistro ? 8 : undefined}
              maxLength={72}
              required 
            />
          </div>

          <button type="submit" className="btn">
            {isRegistro ? 'Criar conta' : 'Entrar no painel'}
          </button>
        </form>

        <p className="auth-switch">
          {isRegistro ? 'Já possui conta?' : 'Ainda não tem acesso?'} 
          <button 
            type="button" 
            onClick={() => setIsRegistro(!isRegistro)}
            className="text-button"
          >
            {isRegistro ? 'Faça Login' : 'Criar Conta'}
          </button>
        </p>
      </div>
    </div>
  );
}