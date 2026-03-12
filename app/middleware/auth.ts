export default defineNuxtRouteMiddleware(async (to) => {
  // Hanya jalankan di client untuk menghindari masalah SSR
  if (import.meta.server) return;

  const token = useCookie('admin_token');

  if (!token.value) {
    return navigateTo('/admin/login');
  }

  // Verifikasi token ke backend — kalau 401/error, hapus cookie dan redirect
  try {
    const config = useRuntimeConfig();
    const API_BASE = config.public.apiBase as string;
    await $fetch(`${API_BASE}/auth/profile`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
  } catch {
    token.value = null;
    return navigateTo('/admin/login');
  }
});
