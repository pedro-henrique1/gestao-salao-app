import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { Clientes } from './pages/Clientes';
import { Profissionais } from './pages/Profissionais';
import { Servicos } from './pages/Servicos';
import { Agendamentos } from './pages/Agendamentos';
import { Caixa } from './pages/Caixa';
import { Login } from './pages/Login'; // IMPORT DA TELA DE LOGIN
import { Dashboard } from './pages/Dashboard';
import './index.css';
import './App.css';

// Criamos um componente NavBar separado para podermos usar o useNavigate dentro dele
function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Apaga o token
    navigate('/login'); // Volta pro login
  };

  // Se estivermos na tela de login, não mostra o menu
  if (window.location.pathname === '/login') return null;

  return (
    <aside className="navbar">
      <div className="brand-lockup">
        <span className="brand-mark">GS</span>
        <div>
          <p className="brand-kicker">Painel administrativo</p>
          <h1>Gestão de Salão</h1>
        </div>
      </div>
      <nav className="nav-links">
        <NavLink to="/" end className="nav-link">Clientes</NavLink>
        <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
        <NavLink to="/profissionais" className="nav-link">Profissionais</NavLink>
        <NavLink to="/servicos" className="nav-link">Serviços</NavLink>
        <NavLink to="/agendamentos" className="nav-link">Agendamentos</NavLink>
        <NavLink to="/caixa" className="nav-link">Caixa</NavLink>
        <button onClick={handleLogout} className="logout-button">Sair</button>
      </nav>
    </aside>
  );
}

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main className="container page-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Clientes />} />
          <Route path="/profissionais" element={<Profissionais />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/caixa" element={<Caixa />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;