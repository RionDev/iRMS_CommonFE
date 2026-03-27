import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { login } from '../services/authService';
import { useAuthStore } from '../stores/authStore';

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authLogin = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string })?.from || '/admin/users';

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
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        if (typeof detail === 'string' && detail.length > 0) {
          setError(detail);
        } else {
          setError(`로그인에 실패했습니다. (${error.response?.status ?? '네트워크 오류'})`);
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
        backgroundColor: '#f5f5f5',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '32px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '360px',
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '20px' }}>
          iRMS 로그인
        </h1>
        {import.meta.env.DEV && (
          <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#666' }}>
            개발 계정: dev-admin@irms / dev1234!
          </p>
        )}
        <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />
      </div>
    </div>
  );
}
