import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useWorkoutStore } from './index';
import * as workoutService from '~/services/workout';

// Mock the services
vi.mock('~/services/workout', () => ({
  getWorkouts: vi.fn(),
  getWorkout: vi.fn(),
}));

describe('useWorkoutStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with correct default state', () => {
    const store = useWorkoutStore();
    expect(store.workouts).toEqual([]);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  describe('fetchWorkouts', () => {
    it('sets workouts on successful fetch', async () => {
      const mockWorkouts = [{ id: 1, name: 'Workout 1' }, { id: 2, name: 'Workout 2' }];
      vi.mocked(workoutService.getWorkouts).mockResolvedValue({ data: mockWorkouts as any, statusCode: 200, message: 'Success' });

      const store = useWorkoutStore();
      
      const fetchPromise = store.fetchWorkouts();
      expect(store.isLoading).toBe(true);
      
      await fetchPromise;
      
      expect(workoutService.getWorkouts).toHaveBeenCalledWith(undefined);
      expect(store.workouts).toEqual(mockWorkouts);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('sets workouts with username on successful fetch', async () => {
      const mockWorkouts = [{ id: 1, name: 'Workout 1' }];
      vi.mocked(workoutService.getWorkouts).mockResolvedValue({ data: mockWorkouts as any, statusCode: 200, message: 'Success' });

      const store = useWorkoutStore();
      await store.fetchWorkouts('john_doe');
      
      expect(workoutService.getWorkouts).toHaveBeenCalledWith('john_doe');
      expect(store.workouts).toEqual(mockWorkouts);
    });

    it('handles error during fetch', async () => {
      const errorMessage = 'API Error';
      vi.mocked(workoutService.getWorkouts).mockRejectedValue(new Error(errorMessage));

      const store = useWorkoutStore();
      await store.fetchWorkouts();
      
      expect(store.workouts).toEqual([]);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(errorMessage);
    });

    it('handles error without message during fetch', async () => {
      vi.mocked(workoutService.getWorkouts).mockRejectedValue({});

      const store = useWorkoutStore();
      await store.fetchWorkouts();
      
      expect(store.workouts).toEqual([]);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe('Erro ao carregar treinos.');
    });
  });

  describe('fetchWorkoutById', () => {
    it('returns workout on successful fetch', async () => {
      const mockWorkout = { id: 1, name: 'Workout 1' };
      vi.mocked(workoutService.getWorkout).mockResolvedValue({ data: mockWorkout as any, statusCode: 200 });

      const store = useWorkoutStore();
      
      const fetchPromise = store.fetchWorkoutById(1);
      expect(store.isLoading).toBe(true);
      
      const result = await fetchPromise;
      
      expect(workoutService.getWorkout).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockWorkout);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('returns null and sets error on fetch failure', async () => {
      const errorMessage = 'Not found';
      vi.mocked(workoutService.getWorkout).mockRejectedValue(new Error(errorMessage));

      const store = useWorkoutStore();
      const result = await store.fetchWorkoutById(999);
      
      expect(result).toBeNull();
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(errorMessage);
    });

    it('returns null and sets default error on fetch failure without message', async () => {
      vi.mocked(workoutService.getWorkout).mockRejectedValue({});

      const store = useWorkoutStore();
      const result = await store.fetchWorkoutById(999);
      
      expect(result).toBeNull();
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe('Erro ao carregar treino.');
    });
  });

  describe('clearWorkouts', () => {
    it('clears workouts and errors', () => {
      const store = useWorkoutStore();
      store.workouts = [{ id: 1, name: 'Workout 1' }] as any;
      store.error = 'Some error';
      
      store.clearWorkouts();
      
      expect(store.workouts).toEqual([]);
      expect(store.error).toBeNull();
    });
  });
});
