import axios from 'axios';
import { defineNuxtPlugin, useCookie, useRouter } from '#app';
import { useUserStore } from '~/stores/user';

export default defineNuxtPlugin(() => {
  const api = axios.create({
    withCredentials: true,
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Se der 401 tentamos revalidar ainda
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // O navegador envia o cookie refreshToken automaticamente
          await axios.get('/api/user/revalidate', { withCredentials: true });

          // Reexecuta a requisição original com os novos cookies gravados pelo backend
          return api(originalRequest);
        } catch (refreshError) {
          // Revalidação falhou, limpa estado e redireciona para login
          const userStore = useUserStore();
          userStore.clearUser();
          const userNameCookie = useCookie<string | null>('userName');
          userNameCookie.value = null;

          const router = useRouter();
          router.push('/auth/signIn');
        }
      }

      return Promise.reject(error);
    }
  );

  return {
    provide: {
      api,
    },
  };
});
