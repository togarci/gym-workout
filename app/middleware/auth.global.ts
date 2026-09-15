export default defineNuxtRouteMiddleware((to) => {
  const userName = useCookie<string | null>('userName');

  if (to.matched.length === 0) {
    if (userName.value && !to.path.includes(userName.value)) {
      return navigateTo(`/${userName.value}`);
    }
    return navigateTo('/auth/signIn');
  }

  if (to.params.userName && to.params.userName !== userName.value) {
    if (userName.value) {
      return navigateTo(`/${userName.value}`);
    } else {
      return navigateTo('/auth/signIn');
    }
  }
});
