export default defineEventHandler((event) => {
  deleteCookie(event, 'accessToken', { path: '/' });
  deleteCookie(event, 'refreshToken', { path: '/' });
  deleteCookie(event, 'userName', { path: '/' });

  return {
    statusCode: 200,
    message: 'Logout realizado com sucesso.',
  };
});
