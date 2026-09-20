import { defineStore } from 'pinia';
import { getExercises, getExercise, registerExercise, updateExercise, type Exercise, type RegisterExercisePayload, type UpdateExercisePayload } from '~/services/exercise';

export const useExerciseStore = defineStore('exercise', () => {
  const exercises = ref<Exercise[]>([]);
  const currentExercise = ref<Exercise | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  async function fetchExercises(name?: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await getExercises(name);
      exercises.value = response.data || [];
    } catch (err: any) {
      console.error('Error fetching exercises in store:', err);
      error.value = err?.message || 'Erro ao carregar exercícios.';
      exercises.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchExerciseById(id: number) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await getExercise(id);
      currentExercise.value = response.data || null;
    } catch (err: any) {
      console.error('Error fetching exercise by ID in store:', err);
      error.value = err?.message || 'Erro ao carregar exercício.';
      currentExercise.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  async function createExercise(payload: RegisterExercisePayload) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await registerExercise(payload);
      return response.data;
    } catch (err: any) {
      console.error('Error creating exercise in store:', err);
      error.value = err?.message || 'Erro ao criar exercício.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateExistingExercise(payload: UpdateExercisePayload) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await updateExercise(payload);
      return response.data;
    } catch (err: any) {
      console.error('Error updating exercise in store:', err);
      error.value = err?.message || 'Erro ao atualizar exercício.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function clearExercises() {
    exercises.value = [];
    currentExercise.value = null;
    error.value = null;
  }

  return {
    exercises,
    currentExercise,
    isLoading,
    error,
    fetchExercises,
    fetchExerciseById,
    createExercise,
    updateExistingExercise,
    clearExercises,
  };
});
