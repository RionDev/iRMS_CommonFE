import type { ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';

interface LayoutProps {
  title: string;
  children: ReactNode;
}

export function Layout({ title, children }: LayoutProps) {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <header
        style={{
          backgroundColor: '#1976d2',
          color: '#fff',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '18px' }}>iRMS — {title}</h1>
        {isAuthenticated && user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px' }}>{user.name}</span>
            <button
              onClick={logout}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.5)',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              로그아웃
            </button>
          </div>
        )}
      </header>
      <main style={{ padding: '24px', maxWidth: '960px', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
}
