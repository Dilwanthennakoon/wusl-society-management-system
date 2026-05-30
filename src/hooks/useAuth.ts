import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthData {
  adminId: number;
  adminName: string;
  adminRole: string;
}

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const adminId = localStorage.getItem('adminId');
    const adminName = localStorage.getItem('adminName');
    const adminRole = localStorage.getItem('adminRole');

    if (adminId && adminName) {
      setAuth({
        adminId: parseInt(adminId),
        adminName,
        adminRole: adminRole || 'Admin',
      });
    }

    setIsLoading(false);
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRole');

    router.push('/login');
  };

  return { auth, isLoading, logout };
};
