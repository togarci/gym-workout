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
  LogoutResponse,
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

export async function revalidateToken(): Promise<RevalidateResponse> {
  const { $api } = useNuxtApp();
  const response = await ($api as AxiosInstance).get<RevalidateResponse>('/api/user/revalidate');
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

export async function logoutUser(): Promise<LogoutResponse> {
  const { $api } = useNuxtApp();
  const response = await ($api as AxiosInstance).post<LogoutResponse>('/api/user/logout');
  return response.data;
}


export * from './types';
