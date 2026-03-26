import { useState } from 'react';
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

  const from = (location.state as { from?: string })?.from || '/';

  const handleSubmit = async (id: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await login({ id, password });
      authLogin({ access_token: res.access_token, refresh_token: res.refresh_token });
      navigate(from, { replace: true });
    } catch {
      setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.');
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
        <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />
      </div>
    </div>
  );
}
