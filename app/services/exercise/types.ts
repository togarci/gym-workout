export interface Exercise {
  id: number;
  name: string;
  muscleGroup?: string | null;
  createdAt?: string | Date;
}

export interface GetExercisesResponse {
  statusCode: number;
  data: Exercise[];
  message?: string;
}

export interface GetExerciseResponse {
  statusCode: number;
  data: Exercise;
  message?: string;
}

export interface RegisterExercisePayload {
  name: string;
  muscleGroup?: string;
}

export interface RegisterExerciseResponse {
  statusCode: number;
  data: Exercise;
  message?: string;
}

export interface UpdateExercisePayload {
  id: number;
  name?: string;
  muscleGroup?: string;
}

export interface UpdateExerciseResponse {
  statusCode: number;
  data: Exercise;
  message?: string;
}
