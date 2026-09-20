import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useExerciseStore } from './index';
import * as exerciseService from '~/services/exercise';

// Mock the services
vi.mock('~/services/exercise', () => ({
  getExercises: vi.fn(),
  getExercise: vi.fn(),
  registerExercise: vi.fn(),
  updateExercise: vi.fn(),
}));

describe('useExerciseStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with correct default state', () => {
    const store = useExerciseStore();
    expect(store.exercises).toEqual([]);
    expect(store.currentExercise).toBeNull();
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  describe('fetchExercises', () => {
    it('sets exercises on successful fetch', async () => {
      const mockExercises = [{ id: 1, name: 'Exercise 1' }];
      vi.mocked(exerciseService.getExercises).mockResolvedValue({ data: mockExercises as any, statusCode: 200, message: 'Success' });

      const store = useExerciseStore();
      
      const fetchPromise = store.fetchExercises();
      expect(store.isLoading).toBe(true);
      
      await fetchPromise;
      
      expect(exerciseService.getExercises).toHaveBeenCalledWith(undefined);
      expect(store.exercises).toEqual(mockExercises);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('sets exercises with name param on successful fetch', async () => {
      const mockExercises = [{ id: 1, name: 'Exercise 1' }];
      vi.mocked(exerciseService.getExercises).mockResolvedValue({ data: mockExercises as any, statusCode: 200, message: 'Success' });

      const store = useExerciseStore();
      await store.fetchExercises('Leg');
      
      expect(exerciseService.getExercises).toHaveBeenCalledWith('Leg');
      expect(store.exercises).toEqual(mockExercises);
    });

    it('handles error during fetch', async () => {
      const errorMessage = 'API Error';
      vi.mocked(exerciseService.getExercises).mockRejectedValue(new Error(errorMessage));

      const store = useExerciseStore();
      await store.fetchExercises();
      
      expect(store.exercises).toEqual([]);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(errorMessage);
    });

    it('handles error without message during fetch', async () => {
      vi.mocked(exerciseService.getExercises).mockRejectedValue({});

      const store = useExerciseStore();
      await store.fetchExercises();
      
      expect(store.exercises).toEqual([]);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe('Erro ao carregar exercícios.');
    });
  });

  describe('fetchExerciseById', () => {
    it('sets currentExercise on successful fetch', async () => {
      const mockExercise = { id: 1, name: 'Exercise 1' };
      vi.mocked(exerciseService.getExercise).mockResolvedValue({ data: mockExercise as any, statusCode: 200 });

      const store = useExerciseStore();
      
      const fetchPromise = store.fetchExerciseById(1);
      expect(store.isLoading).toBe(true);
      
      await fetchPromise;
      
      expect(exerciseService.getExercise).toHaveBeenCalledWith(1);
      expect(store.currentExercise).toEqual(mockExercise);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('handles error during fetch by ID', async () => {
      vi.mocked(exerciseService.getExercise).mockRejectedValue(new Error('Not found'));

      const store = useExerciseStore();
      await store.fetchExerciseById(999);
      
      expect(store.currentExercise).toBeNull();
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe('Not found');
    });

    it('handles error without message during fetch by ID', async () => {
      vi.mocked(exerciseService.getExercise).mockRejectedValue({});

      const store = useExerciseStore();
      await store.fetchExerciseById(999);
      
      expect(store.currentExercise).toBeNull();
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe('Erro ao carregar exercício.');
    });
  });

  describe('createExercise', () => {
    it('returns data on successful create', async () => {
      const payload = { name: 'New Exercise', description: 'desc', videoUrl: '' };
      const responseData = { id: 2, ...payload };
      vi.mocked(exerciseService.registerExercise).mockResolvedValue({ data: responseData as any, statusCode: 201 });

      const store = useExerciseStore();
      
      const createPromise = store.createExercise(payload);
      expect(store.isLoading).toBe(true);
      
      const result = await createPromise;
      
      expect(exerciseService.registerExercise).toHaveBeenCalledWith(payload);
      expect(result).toEqual(responseData);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('throws error and sets error state on failure', async () => {
      const payload = { name: 'New Exercise', description: 'desc', videoUrl: '' };
      vi.mocked(exerciseService.registerExercise).mockRejectedValue(new Error('Creation failed'));

      const store = useExerciseStore();
      
      await expect(store.createExercise(payload)).rejects.toThrow('Creation failed');
      
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe('Creation failed');
    });

    it('throws error and sets default error state on failure without message', async () => {
      const payload = { name: 'New Exercise', description: 'desc', videoUrl: '' };
      vi.mocked(exerciseService.registerExercise).mockRejectedValue({});

      const store = useExerciseStore();
      
      await expect(store.createExercise(payload)).rejects.toEqual({});
      
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe('Erro ao criar exercício.');
    });
  });

  describe('updateExistingExercise', () => {
    it('returns data on successful update', async () => {
      const payload = { id: 1, name: 'Updated Exercise' };
      const responseData = { ...payload };
      vi.mocked(exerciseService.updateExercise).mockResolvedValue({ data: responseData as any, statusCode: 200 });

      const store = useExerciseStore();
      
      const updatePromise = store.updateExistingExercise(payload as any);
      expect(store.isLoading).toBe(true);
      
      const result = await updatePromise;
      
      expect(exerciseService.updateExercise).toHaveBeenCalledWith(payload);
      expect(result).toEqual(responseData);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('throws error and sets error state on failure', async () => {
      const payload = { id: 1, name: 'Updated Exercise' };
      vi.mocked(exerciseService.updateExercise).mockRejectedValue(new Error('Update failed'));

      const store = useExerciseStore();
      
      await expect(store.updateExistingExercise(payload as any)).rejects.toThrow('Update failed');
      
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe('Update failed');
    });

    it('throws error and sets default error state on failure without message', async () => {
      const payload = { id: 1, name: 'Updated Exercise' };
      vi.mocked(exerciseService.updateExercise).mockRejectedValue({});

      const store = useExerciseStore();
      
      await expect(store.updateExistingExercise(payload as any)).rejects.toEqual({});
      
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe('Erro ao atualizar exercício.');
    });
  });

  describe('clearExercises', () => {
    it('clears state correctly', () => {
      const store = useExerciseStore();
      store.exercises = [{ id: 1, name: 'Ex 1' }] as any;
      store.currentExercise = { id: 1, name: 'Ex 1' } as any;
      store.error = 'Some error';
      
      store.clearExercises();
      
      expect(store.exercises).toEqual([]);
      expect(store.currentExercise).toBeNull();
      expect(store.error).toBeNull();
    });
  });
});
