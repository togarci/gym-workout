import database from '~/states/data.workout.json';

export default defineNuxtRouteMiddleware((to, from) => {
  const userName = useCookie('userName');
  const userNameExist = database.some((dt) => dt.userName === userName.value);

  if (userNameExist && !to.path.includes(String(userName.value))) return navigateTo(`/${userName.value}`);

  if (!userNameExist && to.path !== '/auth/signIn') {
    return navigateTo('/auth/signIn');
  }
});
