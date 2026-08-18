import { useNuxtApp } from '#app';
import type { AxiosInstance } from 'axios';
import type { GetWorkoutsResponse } from './types';

export async function getWorkouts(userName?: string): Promise<GetWorkoutsResponse> {
  const { $api } = useNuxtApp();
  const response = await ($api as AxiosInstance).get<GetWorkoutsResponse>('/api/workout/get', {
    params: userName ? { userName } : undefined,
  });
  return response.data;
}

export async function getWorkout(id: number): Promise<{ statusCode: number; data: any }> {
  const { $api } = useNuxtApp();
  const response = await ($api as AxiosInstance).get<{ statusCode: number; data: any }>(`/api/workout/${id}`);
  return response.data;
}

export * from './types';
