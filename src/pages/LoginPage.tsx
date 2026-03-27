import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { Modal } from '../components/Modal';
import { login } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import { theme } from '../styles/theme';

export function LoginPage() {
  type AuthState = ReturnType<typeof useAuthStore.getState>;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const authLogin = useAuthStore((s: AuthState) => s.login);
  const isAuthenticated = useAuthStore((s: AuthState) => s.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const stateFrom =
    typeof location.state === 'object' &&
    location.state !== null &&
    'from' in location.state &&
    typeof location.state.from === 'string'
      ? location.state.from
      : null;

  const from =
    searchParams.get('redirect') ||
    stateFrom ||
    '/admin/users';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [from, isAuthenticated, navigate]);

  const handleSubmit = async (id: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const normalizedId = id
        .trim()
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/\s+/g, '');
      const res = await login({ id: normalizedId, password });
      authLogin({ access_token: res.access_token, refresh_token: res.refresh_token });
      navigate(from, { replace: true });
    } catch (caughtError: unknown) {
      if (axios.isAxiosError(caughtError)) {
        const detail = caughtError.response?.data?.detail;
        if (typeof detail === 'string' && detail.length > 0) {
          if (detail.includes('승인 대기')) {
            setPendingMessage(detail);
          } else {
            setError(detail);
          }
        } else {
          setError(`로그인에 실패했습니다. (${caughtError.response?.status ?? '네트워크 오류'})`);
        }
      } else {
        setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.pageBackground,
        color: theme.colors.text,
        fontFamily: theme.fontFamily,
      }}
    >
      <div
        style={{
          backgroundColor: theme.colors.surface,
          padding: '32px',
          borderRadius: theme.radius.md,
          boxShadow: theme.shadow.card,
          width: '100%',
          maxWidth: '360px',
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '20px' }}>
          iRMS 로그인
        </h1>
        <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />
      </div>
      <Modal
        isOpen={pendingMessage !== null}
        onClose={() => setPendingMessage(null)}
        title="승인 대기"
      >
        <p style={{ margin: 0, color: theme.colors.text }}>{pendingMessage}</p>
      </Modal>
    </div>
  );
}
