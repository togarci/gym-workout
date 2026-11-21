import { useUserStore } from '~/stores/user';

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();
  const userNameCookie = useCookie<string | null>('userName');

  const userName = userStore.userName || userNameCookie.value;

  if (!userStore.isAuthenticated || !userName) {
    return;
  }

  const isPersonal = userStore.isPersonal;
  const isPersonalRoute =
    to.path.startsWith('/personal') && !to.path.startsWith('/personal/auth');
  const isGlobalRoute = !to.path.startsWith('/personal') && Boolean(to.params.userName);

  if (isPersonal && isGlobalRoute) {
    return navigateTo(`/personal/${userName}`);
  }

  if (!isPersonal && isPersonalRoute) {
    return navigateTo(`/${userName}`);
  }
});
