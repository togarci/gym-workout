import { useNuxtApp } from '#app';
import type { AxiosInstance } from 'axios';
import type {
  LoginPayload,
  LoginResponse,
  RevalidateResponse,
  LogoutResponse,
} from './types';

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const { $api } = useNuxtApp();
  const response = await ($api as AxiosInstance).post<LoginResponse>('/api/auth/login', payload);
  return response.data;
}

export async function revalidateToken(): Promise<RevalidateResponse> {
  const { $api } = useNuxtApp();
  const response = await ($api as AxiosInstance).get<RevalidateResponse>('/api/auth/revalidate');
  return response.data;
}

export async function logoutUser(): Promise<LogoutResponse> {
  const { $api } = useNuxtApp();
  const response = await ($api as AxiosInstance).post<LogoutResponse>('/api/auth/logout');
  return response.data;
}

export * from './types';
