import axios from 'axios';
import { defineNuxtPlugin, useCookie, useRouter } from '#app';
import { useUserStore } from '~/stores/user';

export default defineNuxtPlugin((nuxtApp) => {
  const api = axios.create({
    // baseURL can be configured here if needed via useRuntimeConfig()
  });

  api.interceptors.request.use((requestConfig) => {
    const accessToken = useCookie('accessToken').value;
    if (accessToken) {
      requestConfig.headers.Authorization = `Bearer ${accessToken}`;
    }
    return requestConfig;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Check if error is 401 and we haven't already retried this request
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = useCookie('refreshToken').value;
          
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // Directly use axios to avoid triggering the interceptor again on failure
          const response = await axios.get('/api/user/revalidate', {
            headers: {
              'x-refresh-token': refreshToken
            }
          });

          // Check the structure depending on your API response
          const newAccessToken = response.data?.data?.accessToken || response.data?.accessToken;
          const newRefreshToken = response.data?.data?.refreshToken || response.data?.refreshToken;

          if (newAccessToken && newRefreshToken) {
            useCookie('accessToken').value = newAccessToken;
            useCookie('refreshToken').value = newRefreshToken;

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } else {
             throw new Error('Invalid tokens returned on revalidate');
          }
        } catch (refreshError) {
          // Revalidate failed, clear state and redirect to login
          useCookie('accessToken').value = null;
          useCookie('refreshToken').value = null;
          useCookie('userName').value = null;

          const userStore = useUserStore();
          userStore.clearUser();

          const router = useRouter();
          router.push('/');
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
