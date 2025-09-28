import EncryptedStorage from 'react-native-encrypted-storage';
import type { AuthToken } from '../types/auth';

const TOKEN_KEY: string = 'auth_token_v1';

export async function saveAuthToken(value: AuthToken): Promise<void> {
  await EncryptedStorage.setItem(TOKEN_KEY, JSON.stringify(value));
}

export async function getAuthToken(): Promise<AuthToken | null> {
  const raw: string | null = await EncryptedStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try {
    const parsed: AuthToken = JSON.parse(raw) as AuthToken;
    return parsed;
  } catch {
    await EncryptedStorage.removeItem(TOKEN_KEY);
    return null;
  }
}

export async function removeAuthToken(): Promise<void> {
  await EncryptedStorage.removeItem(TOKEN_KEY);
}
