import { useState, useCallback } from 'react';
import type { AuthToken } from '../types/auth';
import { LoginParams, postLogin } from '../api/loginAPI';

export interface UseLoginStates {
  token: AuthToken | null;
  isLoading: boolean;
  error: string | null;
  loginUser: (params: LoginParams) => Promise<void>;
}

export function useLogin(): UseLoginStates {
  const [token, setToken] = useState<AuthToken | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginUser = useCallback(async ({ email, password }: LoginParams) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log(email);
      const res = await postLogin({ email, password });
      console.log(res);
      setToken(res);
    } catch (e: unknown) {
      console.log(e);
      setError(
        e instanceof Error ? e.message : 'Something went wrong during login.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { token, isLoading, error, loginUser };
}
