import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

// Dashboard base: HU04 agrega la lista de gastos y HU06 los totales por categoría.
export default function Dashboard() {
  const { user, endSession } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    endSession();
    navigate('/login');
  }

  return (
    <main className="screen">
      <div className="card center">
        <div className="logo">MoneyMind</div>
        <h1 className="title">Hola, {user?.nombre?.split(' ')[0]} 👋</h1>
        <p className="muted">Tu cuenta está lista. Moneda: {user?.moneda}</p>
        <button className="btn secondary" type="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}
