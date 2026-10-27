import { createContext, useContext, useEffect, useState } from 'react';
import api from './api';
const Ctx = createContext();
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null), [loading, setLoading] = useState(!!localStorage.getItem('token'));
  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    api.get('/auth/me').then(r => setUser(r.data)).catch(() => localStorage.removeItem('token')).finally(() => setLoading(false));
  }, []);
  const start = ({ token, user }) => { localStorage.setItem('token', token); setUser(user); };
  const login = async (email, password) => start((await api.post('/auth/login', { email, password })).data);
  const register = async (name, email, password) => start((await api.post('/auth/register', { name, email, password })).data);
  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  return <Ctx.Provider value={{ user, loading, login, register, logout }}>{children}</Ctx.Provider>;
}
