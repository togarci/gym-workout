export interface Exercise {
  name: string;
  sets: number | string;
  reps: number | string;
  obs?: string;
  notes?: string;
}

export interface Workout {
  id: number;
  name: string;
  description?: string | null;
  duration?: string | null;
  observations?: string | null;
  exercises: Exercise[];
  restBeforeSecondBlock?: string | null;
  restAfterSecondBlock?: string | null;
}

export interface GetWorkoutsResponse {
  statusCode: number;
  data: Workout[];
  message?: string;
}
