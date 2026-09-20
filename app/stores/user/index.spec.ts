import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from './index';
import type { User } from '~/services/user/types';

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with correct default state', () => {
    const store = useUserStore();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(store.userName).toBe('');
  });

  describe('setUser', () => {
    it('sets the user data correctly', () => {
      const mockUser = {
        id: 1,
        userName: 'johndoe',
        email: 'john@example.com',
      } as User;
      
      const store = useUserStore();
      store.setUser(mockUser);
      
      expect(store.user).toEqual(mockUser);
      expect(store.isAuthenticated).toBe(true);
      expect(store.userName).toBe('johndoe');
    });

    it('sets the user to null correctly', () => {
      const store = useUserStore();
      
      // Configurar estado inicial com usuário
      store.setUser({ userName: 'test' } as User);
      expect(store.isAuthenticated).toBe(true);
      
      // Setar para null
      store.setUser(null);
      expect(store.user).toBeNull();
      expect(store.isAuthenticated).toBe(false);
      expect(store.userName).toBe('');
    });
  });

  describe('clearUser', () => {
    it('clears the user correctly', () => {
      const store = useUserStore();
      store.setUser({ userName: 'test' } as User);
      expect(store.isAuthenticated).toBe(true);
      
      store.clearUser();
      
      expect(store.user).toBeNull();
      expect(store.isAuthenticated).toBe(false);
      expect(store.userName).toBe('');
    });
  });
});
