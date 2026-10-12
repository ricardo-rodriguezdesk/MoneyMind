import { createContext, useContext, useEffect, useState } from 'react';
import { api, tokenStore } from './lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Mientras se confirma la sesión guardada no se decide a qué pantalla ir
  const [checking, setChecking] = useState(() => Boolean(tokenStore.get()));

  // HU02 — Al abrir la app: si hay una sesión guardada y sigue vigente, entra directo
  useEffect(() => {
    if (!tokenStore.get()) return;
    api('/auth/me')
      .then(({ user: current }) => setUser(current))
      .catch((err) => {
        if (err.status === 401) tokenStore.clear(); // sesión vencida o inválida
      })
      .finally(() => setChecking(false));
  }, []);

  function startSession({ token, user: nextUser }) {
    tokenStore.set(token);
    setUser(nextUser);
  }

  function endSession() {
    tokenStore.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, checking, startSession, endSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
