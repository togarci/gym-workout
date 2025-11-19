export interface DatabaseTypes {
  userName: string;
  workouts: {
    id: number;
    name: string;
    duration?: string;
    exercises: {
      name: string;
      sets: number;
      reps: number | string;
      obs?: string;
    }[];
  }[];
}
