import { useEffect } from 'react';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/authStore';

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!token) return;

    authApi
      .getMe()
      .then((user) => setAuth(token, user))
      .catch(() => logout());
  }, [token, setAuth, logout]);

  return <>{children}</>;
}
