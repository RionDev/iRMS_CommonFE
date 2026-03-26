import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname }, replace: true });
    }
  }, [isAuthenticated, navigate, location.pathname]);

  return { user, isAuthenticated, logout };
}

export function useRequireRole(...allowedRoles: number[]) {
  const { user } = useAuth();

  if (user && !allowedRoles.includes(user.role)) {
    throw new Error('권한이 없습니다');
  }

  return user;
}
