import { useAuth } from '../auth.jsx';

// Dashboard base: HU04 agrega la lista de gastos y HU06 los totales por categoría.
export default function Dashboard() {
  const { user } = useAuth();
  return (
    <main className="screen">
      <div className="card center">
        <div className="logo">MoneyMind</div>
        <h1 className="title">Hola, {user?.nombre?.split(' ')[0]} 👋</h1>
        <p className="muted">Tu cuenta está lista. Moneda: {user?.moneda}</p>
      </div>
    </main>
  );
}
