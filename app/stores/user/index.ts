import { defineStore } from 'pinia';
import type { User } from '~/services/user/types';

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref<User | null>(null);

    const isAuthenticated = computed(() => !!user.value);
    const userName = computed(() => user.value?.userName || '');

    function setUser(userData: User | null) {
      user.value = userData;
    }

    function clearUser() {
      user.value = null;
    }

    return {
      user,
      isAuthenticated,
      userName,
      setUser,
      clearUser,
    };
  },
  {
    persist: true,
  }
);
