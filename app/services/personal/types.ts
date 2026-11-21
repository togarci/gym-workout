export interface PersonalTeamGlobalUser {
  id: number;
  userName: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
  role?: { id: number; name: 'personal' | 'global' } | null;
}

export interface PersonalTeamGlobal {
  id: number;
  name?: string | null;
  userId: number;
  personalId: number;
  user: PersonalTeamGlobalUser;
  workouts: { workoutId: number }[];
}

export interface GetPersonalTeamResponse {
  statusCode: number;
  data: PersonalTeamGlobal[];
}
