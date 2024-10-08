'use client';

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  token: string | null;
  loading: boolean;
  login: (newToken: string, authUser: any) => void;
  logout: () => void;
  setAuthUser: (authUser: any) => void;
  authUser: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<{} | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('accesstoken');
    const authUser = localStorage.getItem('authUser');

    if (savedToken) {
      setToken(savedToken);
    }

    if (authUser || authUser !== "undefined") {
      setAuthUser(JSON.parse(authUser || '{}'));
    }

    setLoading(false);
  }, []);

  const login = (newToken: string, authUser: any) => {
    localStorage.setItem('accesstoken', newToken);
    localStorage.setItem('authUser', JSON.stringify(authUser));
    document.cookie = `token=${newToken}; path=/; max-age=3600; SameSite=Strict`;
    setToken(newToken);
    setAuthUser(authUser);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('accesstoken');
    localStorage.removeItem('authUser');
    setToken(null);
    setAuthUser(null);
    setLoading(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ token, authUser, loading, login, logout, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
