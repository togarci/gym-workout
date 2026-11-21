import { useNuxtApp } from '#app';
import type { AxiosInstance } from 'axios';
import type { GetPersonalTeamResponse } from './types';

export async function getPersonalTeam(): Promise<GetPersonalTeamResponse> {
  const { $api } = useNuxtApp();
  const response = await ($api as AxiosInstance).get<GetPersonalTeamResponse>('/api/personal/team');
  return response.data;
}

export * from './types';
