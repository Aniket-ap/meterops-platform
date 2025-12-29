import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
      setTenant(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users/me');
      if (data.success) {
        setUser(data.data.user);
        setTenant(data.data.tenant);
      }
    } catch (error) {
      console.error('Failed to fetch user', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token } = response.data.data;
    localStorage.setItem('token', token);
    setToken(token);
    await fetchUser();
    return response.data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register-tenant', payload);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    await fetchUser();
    return data;
  };

  const acceptInvite = async (payload) => {
    await api.post('/users/accept-invite', payload);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setTenant(null);
  };

  return (
    <AuthContext.Provider value={{ user, tenant, token, login, register, acceptInvite, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
