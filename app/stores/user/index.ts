import { defineStore } from 'pinia';
import type { User } from '~/services/user/types';

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref<User | null>(null);

    const isAuthenticated = computed(() => !!user.value);
    const userName = computed(() => user.value?.userName || '');
    const isPersonal = computed(() =>
      Boolean(
        user.value?.isPersonal ??
          (user.value?.role?.name === 'personal' || Boolean(user.value?.personal))
      )
    );

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
      isPersonal,
      setUser,
      clearUser,
    };
  },
  {
    persist: true,
  }
);
