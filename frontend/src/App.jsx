import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';

function Private({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/registro" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/registro" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <Private>
              <Dashboard />
            </Private>
          }
        />
        <Route path="*" element={<Navigate to="/registro" replace />} />
      </Routes>
    </AuthProvider>
  );
}
