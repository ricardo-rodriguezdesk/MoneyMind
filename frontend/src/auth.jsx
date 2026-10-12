import { createContext, useContext, useState } from 'react';
import { tokenStore } from './lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('moneymind_user'));
    } catch {
      return null;
    }
  });

  function startSession({ token, user: nextUser }) {
    tokenStore.set(token);
    localStorage.setItem('moneymind_user', JSON.stringify(nextUser));
    setUser(nextUser);
  }

  function endSession() {
    tokenStore.clear();
    localStorage.removeItem('moneymind_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, startSession, endSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
