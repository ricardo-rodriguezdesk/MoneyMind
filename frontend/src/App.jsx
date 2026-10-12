import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';

/** Pantallas que exigen sesión. */
function Private({ children }) {
  const { user, checking } = useAuth();
  if (checking) return null;
  return user ? children : <Navigate to="/login" replace />;
}

/** Login y registro: si ya hay sesión, se salta directo al dashboard. */
function Public({ children }) {
  const { user, checking } = useAuth();
  if (checking) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/login"
          element={
            <Public>
              <Login />
            </Public>
          }
        />
        <Route
          path="/registro"
          element={
            <Public>
              <Register />
            </Public>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Private>
              <Dashboard />
            </Private>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
