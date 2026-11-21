import axios from 'axios';
import { defineNuxtPlugin, useCookie, useRouter } from '#app';
import { useUserStore } from '~/stores/user';

// Rotas em que um erro não deve disparar a revalidação do token
const PUBLIC_AUTH_ROUTES = ['/api/auth/login', '/api/user/register'];

export default defineNuxtPlugin(() => {
  const api = axios.create({
    withCredentials: true,
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Rotas públicas: não há sessão para revalidar, apenas repassa o erro
      const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some((route) =>
        originalRequest?.url?.includes(route),
      );

      if (isPublicAuthRoute) {
        return Promise.reject(error);
      }

      // Se der 401 tentamos revalidar ainda
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // O navegador envia o cookie refreshToken automaticamente
          await axios.get('/api/auth/revalidate', { withCredentials: true });

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
