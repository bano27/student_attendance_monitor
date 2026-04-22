import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginSession } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loginSession: null,
  });

  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      setAuthState(JSON.parse(stored));
    }
  }, []);

  const login = (email: string, password: string): { success: boolean; message: string } => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) return { success: false, message: 'Invalid email or password.' };

    const session: LoginSession = {
      userId: user.id,
      loginTime: new Date().toISOString(),
      device: navigator.userAgent.includes('Chrome') ? 'Chrome Browser' : 'Web Browser',
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 254 + 1),
    };

    const newState: AuthState = { user, isAuthenticated: true, loginSession: session };
    setAuthState(newState);
    localStorage.setItem('auth', JSON.stringify(newState));
    return { success: true, message: 'Login successful.' };
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false, loginSession: null });
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
