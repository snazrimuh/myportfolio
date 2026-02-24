export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('admin_token');

  if (!token.value) {
    return navigateTo('/admin/login');
  }
});
