import { useNuxtApp } from '#app';
import type { AxiosInstance } from 'axios';
import type {
  RegisterPayload,
  RegisterResponse,
  UpdateUserPayload,
  UpdateUserResponse,
  DeleteUserPayload,
  DeleteUserResponse,
} from './types';

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const { $api } = useNuxtApp();
  const response = await ($api as AxiosInstance).post<RegisterResponse>('/api/user/register', payload);
  return response.data;
}

export async function updateUser({ id, ...data }: UpdateUserPayload): Promise<UpdateUserResponse> {
  const { $api } = useNuxtApp();
  const response = await ($api as AxiosInstance).put<UpdateUserResponse>(`/api/user/${id}`, data);
  return response.data;
}

export async function deleteUser(payload: DeleteUserPayload | number): Promise<DeleteUserResponse> {
  const { $api } = useNuxtApp();
  const id = typeof payload === 'number' ? payload : payload.id;
  const response = await ($api as AxiosInstance).delete<DeleteUserResponse>(`/api/user/${id}`);
  return response.data;
}

export * from './types';
