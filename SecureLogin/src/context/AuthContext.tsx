import React, { createContext, useEffect, useMemo, useState } from 'react';
import type { JSX, ReactNode } from 'react';
import type { AuthToken } from '../types/auth';
import { getAuthToken } from '../storage/storage';

export interface AuthContextValue {
  token: AuthToken | null;
  isBootstrapping: boolean;
  // Step-2 will add: login(credentials), logout()
}

export const AuthContext = createContext<AuthContextValue>({
  token: null,
  isBootstrapping: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [token, setToken] = useState<AuthToken | null>(null);
  const [isBootstrapping, setBootstrapping] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const existing: AuthToken | null = await getAuthToken();
      setToken(existing);
      setBootstrapping(false);
    })();
  }, []);

  const value: AuthContextValue = useMemo(
    () => ({ token, isBootstrapping }),
    [token, isBootstrapping],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
