import type { ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';
import { SideNav } from './SideNav';
import type { SideNavItem } from './SideNav';
import { theme } from '../styles/theme';

interface LayoutProps {
  title: string;
  children: ReactNode;
  sideNavItems?: SideNavItem[];
}

export function Layout({ title, children, sideNavItems = [] }: LayoutProps) {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: theme.colors.pageBackground,
        color: theme.colors.text,
        fontFamily: theme.fontFamily,
      }}
    >
      <header
        style={{
          backgroundColor: theme.colors.primary,
          color: theme.colors.primaryText,
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
                color: theme.colors.primaryText,
                padding: '4px 12px',
                borderRadius: theme.radius.sm,
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: theme.fontFamily,
              }}
            >
              로그아웃
            </button>
          </div>
        )}
      </header>
      <main style={{ padding: '24px', maxWidth: theme.layout.contentMaxWidth, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          {sideNavItems.length > 0 && <SideNav items={sideNavItems} />}
          <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
        </div>
      </main>
    </div>
  );
}
