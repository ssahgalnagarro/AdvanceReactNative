import axios, { AxiosInstance } from 'axios';
import type { AuthToken } from '../types/auth';

const BASE_URL: string = 'https://api.escuelajs.co/api/v1';

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;

export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export async function postLogin(params: LoginParams): Promise<AuthToken> {
  const response = await client.post<LoginResponse>('/auth/login', params);
  console.log(response);
  return {
    token: response.data.access_token,
    issuedAt: Date.now(),
  };
}
