import { useNuxtApp } from '#app';
import type { AxiosInstance } from 'axios';
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  RevalidateResponse,
  UpdateUserPayload,
  UpdateUserResponse,
  DeleteUserPayload,
  DeleteUserResponse,
} from './types';

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const { $api } = useNuxtApp();
  const response = await ($api as AxiosInstance).post<LoginResponse>('/api/user/login', payload);
  return response.data;
}

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const { $api } = useNuxtApp();
  const response = await ($api as AxiosInstance).post<RegisterResponse>('/api/user/register', payload);
  return response.data;
}

export async function revalidateToken(refreshToken?: string): Promise<RevalidateResponse> {
  const { $api } = useNuxtApp();
  const headers: Record<string, string> = {};
  if (refreshToken) {
    headers['x-refresh-token'] = refreshToken;
  }
  const response = await ($api as AxiosInstance).get<RevalidateResponse>('/api/user/revalidate', { headers });
  return response.data;
}

export async function updateUser(payload: UpdateUserPayload): Promise<UpdateUserResponse> {
  const { $api } = useNuxtApp();
  const response = await ($api as AxiosInstance).put<UpdateUserResponse>('/api/user/update', payload);
  return response.data;
}

export async function deleteUser(payload: DeleteUserPayload): Promise<DeleteUserResponse> {
  const { $api } = useNuxtApp();
  const response = await ($api as AxiosInstance).delete<DeleteUserResponse>('/api/user/delete', {
    data: payload,
  });
  return response.data;
}


export * from './types';
