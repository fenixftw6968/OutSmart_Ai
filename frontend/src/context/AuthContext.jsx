import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMeApi, loginApi, registerApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('outsmart_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await getMeApi();
      setUser(res.data);
    } catch (err) {
      console.error('Failed to load user profile:', err);
      localStorage.removeItem('outsmart_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (credentials) => {
    const res = await loginApi(credentials);
    const { token, ...userData } = res.data;
    localStorage.setItem('outsmart_token', token);
    setUser(userData);
    return res.data;
  };

  const register = async (data) => {
    const res = await registerApi(data);
    const { token, ...userData } = res.data;
    localStorage.setItem('outsmart_token', token);
    setUser(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('outsmart_token');
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
