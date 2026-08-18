import { defineStore } from 'pinia';
import { getWorkouts, type Workout } from '~/services/workout';

export const useWorkoutStore = defineStore('workout', () => {
  const workouts = ref<Workout[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  async function fetchWorkouts(userName?: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await getWorkouts(userName);
      workouts.value = response.data || [];
    } catch (err: any) {
      console.error('Error fetching workouts in store:', err);
      error.value = err?.message || 'Erro ao carregar treinos.';
      workouts.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  function clearWorkouts() {
    workouts.value = [];
    error.value = null;
  }

  return {
    workouts,
    isLoading,
    error,
    fetchWorkouts,
    clearWorkouts,
  };
});
