import type { GetWorkoutsResponse } from './types';

export async function getWorkouts(userName?: string): Promise<GetWorkoutsResponse> {
  return await $fetch<GetWorkoutsResponse>('/api/workout/get', {
    method: 'GET',
    params: userName ? { userName } : undefined,
  });
}

export * from './types';
