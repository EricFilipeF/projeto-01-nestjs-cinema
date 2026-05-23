import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AuthSession, AuthUser, LoginInput } from '../models/Auth';
import { authService } from '../services/authService';
import { clearStoredAuth, getStoredAuth, setStoredAuth } from '../services/authStorage';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginInput) => Promise<AuthSession>;
  logout: () => void;
}

const storedAuth = getStoredAuth();

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(storedAuth);

  const login = async (credentials: LoginInput) => {
    const authSession = await authService.login(credentials);
    setStoredAuth(authSession);
    setSession(authSession);
    return authSession;
  };

  const logout = () => {
    clearStoredAuth();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        token: session?.accessToken ?? null,
        isAuthenticated: Boolean(session?.accessToken),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}