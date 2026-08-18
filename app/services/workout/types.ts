export interface Workout {
  id: number;
  name: string;
  description?: string | null;
}

export interface GetWorkoutsResponse {
  statusCode: number;
  data: Workout[];
  message?: string;
}
