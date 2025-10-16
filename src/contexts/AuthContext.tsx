
import Cookies from 'js-cookie';
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getUserInfo } from '../api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;
    const token = Cookies.get('token');

    if (token) {
      getUserInfo(token)
        .then(userData => {
          if (!cancelled) {
            setUser(userData);
          }
        })
        .catch(() => {
          if (!cancelled) {
            Cookies.remove('token');
            setUser(null);
          }
        });
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (token: string) => {
    try {
      const userData = await getUserInfo(token);
      Cookies.set('token', token);
      setUser(userData);
    } catch (error) {
      Cookies.remove('token');
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
