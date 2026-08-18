import { useNuxtApp } from '#app';
import type { AxiosInstance } from 'axios';
import type {
  GetExercisesResponse,
  GetExerciseResponse,
  RegisterExercisePayload,
  RegisterExerciseResponse,
  UpdateExercisePayload,
  UpdateExerciseResponse,
} from './types';

export async function getExercises(name?: string): Promise<GetExercisesResponse> {
  const { $api } = useNuxtApp();
  const response = await ($api as AxiosInstance).get<GetExercisesResponse>('/api/exercise/get', {
    params: name ? { name } : undefined,
  });
  return response.data;
}

export async function getExercise(id: number): Promise<GetExerciseResponse> {
  const { $api } = useNuxtApp();
  const response = await ($api as AxiosInstance).get<GetExerciseResponse>(`/api/exercise/${id}`);
  return response.data;
}

export async function registerExercise(payload: RegisterExercisePayload): Promise<RegisterExerciseResponse> {
  const { $api } = useNuxtApp();
  const response = await ($api as AxiosInstance).post<RegisterExerciseResponse>('/api/exercise/register', payload);
  return response.data;
}

export async function updateExercise(payload: UpdateExercisePayload): Promise<UpdateExerciseResponse> {
  const { $api } = useNuxtApp();
  const response = await ($api as AxiosInstance).put<UpdateExerciseResponse>('/api/exercise/update', payload);
  return response.data;
}

export * from './types';
