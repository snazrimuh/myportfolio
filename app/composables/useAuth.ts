interface Admin {
  id: number;
  email: string;
}

interface LoginResponse {
  access_token: string;
  admin: Admin;
}

export function useAuth() {
  const token = useCookie('admin_token', { maxAge: 60 * 60 * 24 }); // 1 day
  const admin = useState<Admin | null>('admin', () => null);
  const api = useApi();

  const isLoggedIn = computed(() => !!token.value);

  async function login(email: string, password: string) {
    const res = await api.post<LoginResponse>('/auth/login', { email, password });
    token.value = res.access_token;
    admin.value = res.admin;
    return res;
  }

  function logout() {
    token.value = null;
    admin.value = null;
    navigateTo('/admin/login');
  }

  async function fetchProfile() {
    if (!token.value) return null;
    try {
      const profile = await api.get<Admin>('/auth/profile');
      admin.value = profile;
      return profile;
    } catch {
      token.value = null;
      admin.value = null;
      return null;
    }
  }

  return {
    token,
    admin,
    isLoggedIn,
    login,
    logout,
    fetchProfile,
  };
}
