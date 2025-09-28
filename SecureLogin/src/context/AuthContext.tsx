import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import type { JSX, ReactNode } from 'react';
import type { AuthToken } from '../types/auth';
import {
  getAuthToken,
  saveAuthToken,
  removeAuthToken,
} from '../storage/storage';

export interface AuthContextValue {
  token: AuthToken | null;
  isBootstrapping: boolean;
  setAuthToken: (token: AuthToken) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  token: null,
  isBootstrapping: true,
  setAuthToken: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [token, setToken] = useState<AuthToken | null>(null);
  const [isBootstrapping, setBootstrapping] = useState<boolean>(true);

  // On app start, load token from secure storage
  useEffect(() => {
    (async () => {
      const existing: AuthToken | null = await getAuthToken();
      setToken(existing);
      setBootstrapping(false);
    })();
  }, []);

  // Expose a method to update + persist token
  const setAuthToken = useCallback(async (authToken: AuthToken) => {
    await saveAuthToken(authToken);
    setToken(authToken);
  }, []);

  // Expose logout
  const logout = useCallback(async () => {
    await removeAuthToken();
    setToken(null);
  }, []);

  const value: AuthContextValue = useMemo(
    () => ({
      token,
      isBootstrapping,
      setAuthToken,
      logout,
    }),
    [token, isBootstrapping, setAuthToken, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
