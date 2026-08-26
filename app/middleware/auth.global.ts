export default defineNuxtRouteMiddleware((to) => {
  if (to.matched.length === 0 || to.path === '/') {
    return navigateTo('/auth/signIn');
  }
});
