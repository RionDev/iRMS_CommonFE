import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import apiClient from "../services/apiClient";
import { useAppsStore } from "../stores/appsStore";
import { useAuthStore } from "../stores/authStore";
import { theme } from "../styles/theme";
import { Button } from "./Button";
import { Input } from "./Input";
import { Modal } from "./Modal";
import type { SideNavItem } from "./SideNav";
import { SideNav } from "./SideNav";

interface LayoutProps {
  title: string;
  children: ReactNode;
  sideNavItems?: SideNavItem[];
  version?: string;
}

const RoleLabel: Record<number, string> = {
  1: "Admin",
  2: "Lead",
  3: "Member",
  4: "Guest",
};
const TeamLabel: Record<number, string> = { 1: "Engine", 2: "Analyst" };

interface AppNavItem {
  label: string;
  basePath: string;
  features: { label: string; href: string }[];
}

const APP_NAV: AppNavItem[] = [
  {
    label: "관리자",
    basePath: "/admin",
    features: [
      { label: "회원 목록", href: "/admin/users" },
      { label: "가입 승인", href: "/admin/approval" },
    ],
  },
];

function ChangePasswordModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSuccess(false);
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      await apiClient.post("/api/user/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setSuccess(true);
    } catch {
      setError("비밀번호 변경에 실패했습니다.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="비밀번호 변경">
      {success ? (
        <>
          <p
            style={{
              color: theme.colors.success,
              fontSize: "14px",
              margin: "8px 0 16px",
            }}
          >
            비밀번호가 변경되었습니다.
          </p>
          <Button type="button" onClick={handleClose} style={{ width: "100%" }}>
            확인
          </Button>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <Input
              label="현재 비밀번호"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <Input
              label="새 비밀번호"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              label="새 비밀번호 확인"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" style={{ width: "100%", marginTop: "8px" }}>
              변경하기
            </Button>
          </form>
          {error && (
            <p
              style={{
                color: theme.colors.danger,
                marginTop: "12px",
                fontSize: "14px",
              }}
            >
              {error}
            </p>
          )}
        </>
      )}
    </Modal>
  );
}

function LogoutButton({ onLogout }: { onLogout: () => void }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        onClick={onLogout}
        style={{
          background: hover ? "rgba(255,255,255,0.15)" : "none",
          border: "none",
          color: theme.colors.primaryText,
          cursor: "pointer",
          padding: "6px",
          display: "flex",
          alignItems: "center",
          borderRadius: theme.radius.sm,
          transition: "background 0.15s",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
      {hover && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.75)",
            color: "#fff",
            fontSize: "12px",
            padding: "4px 10px",
            borderRadius: theme.radius.sm,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          로그아웃
        </div>
      )}
    </div>
  );
}

function PwChangeButton({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        width: "100%",
        background: active ? theme.colors.borderStrong : hover ? theme.colors.surfaceMuted : theme.colors.pageBackground,
        border: "none",
        padding: "8px 12px",
        borderRadius: theme.radius.sm,
        cursor: "pointer",
        fontSize: "13px",
        fontFamily: theme.fontFamily,
        color: theme.colors.text,
        transition: "background 0.15s",
      }}
    >
      비밀번호 변경
    </button>
  );
}

function ProfileMenu({
  user,
}: {
  user: { id: string; name: string; role: number; team: number };
}) {
  const [open, setOpen] = useState(false);
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const [hover, setHover] = useState(false);

  return (
    <div
      ref={ref}
      style={{ position: "relative" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: hover || open ? "rgba(255,255,255,0.15)" : "none",
          border: "none",
          color: theme.colors.primaryText,
          cursor: "pointer",
          fontSize: "14px",
          fontFamily: theme.fontFamily,
          padding: "4px 8px",
          borderRadius: theme.radius.sm,
          transition: "background 0.15s",
        }}
      >
        {user.name} ▾
      </button>
      {hover && !open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.75)",
            color: "#fff",
            fontSize: "12px",
            padding: "4px 10px",
            borderRadius: theme.radius.sm,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          계정 정보
        </div>
      )}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "#fff",
            color: theme.colors.text,
            borderRadius: theme.radius.md,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            zIndex: 1000,
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              padding: "16px",
              borderBottom: `1px solid ${theme.colors.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "8px",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: "15px" }}>
                {user.name}
              </span>
              <span style={{ fontSize: "13px", color: theme.colors.textMuted }}>
                {user.team
                  ? `${TeamLabel[user.team] ?? `팀 ${user.team}`} · `
                  : ""}
                {RoleLabel[user.role] ?? `역할 ${user.role}`}
              </span>
            </div>
            <div style={{ fontSize: "13px", color: theme.colors.textMuted, marginTop: "4px" }}>
              {user.id}
            </div>
          </div>
          <div style={{ padding: "12px 16px" }}>
            <PwChangeButton
              onClick={() => {
                setOpen(false);
                setPwModalOpen(true);
              }}
            />
          </div>
        </div>
      )}
      <ChangePasswordModal
        isOpen={pwModalOpen}
        onClose={() => setPwModalOpen(false)}
      />
    </div>
  );
}

function FeatureLink({ label, href }: { label: string; href: string }) {
  const [hover, setHover] = useState(false);
  const isActive = window.location.pathname === href;

  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block",
        padding: "10px 16px",
        textDecoration: "none",
        fontSize: "14px",
        color: isActive ? theme.colors.primary : theme.colors.text,
        fontWeight: isActive ? 600 : 400,
        backgroundColor: hover ? theme.colors.pageBackground : "transparent",
        transition: "background-color 0.15s",
      }}
    >
      {label}
    </a>
  );
}

function AppLauncher() {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { apps } = useAppsStore();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const visibleApps = APP_NAV.filter((app) =>
    apps.some((a) => a.path === app.basePath),
  );

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v: boolean) => !v)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: open
            ? "rgba(255,255,255,0.15)"
            : hover
              ? "rgba(255,255,255,0.1)"
              : "none",
          border: "none",
          color: theme.colors.primaryText,
          cursor: "pointer",
          padding: "6px",
          display: "flex",
          alignItems: "center",
          borderRadius: theme.radius.sm,
          transition: "background 0.15s",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="6" cy="6" r="2" />
          <circle cx="12" cy="6" r="2" />
          <circle cx="18" cy="6" r="2" />
          <circle cx="6" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="18" cy="12" r="2" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="12" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      </button>
      {hover && !open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.75)",
            color: "#fff",
            fontSize: "12px",
            padding: "4px 10px",
            borderRadius: theme.radius.sm,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          앱
        </div>
      )}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "#fff",
            color: theme.colors.text,
            borderRadius: theme.radius.md,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            minWidth: "200px",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          {visibleApps.map((app, i) => (
            <div key={app.basePath}>
              {i > 0 && (
                <div
                  style={{ borderTop: `1px solid ${theme.colors.border}` }}
                />
              )}
              <div
                style={{
                  padding: "12px 16px 4px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: theme.colors.textMuted,
                }}
              >
                {app.label}
              </div>
              {app.features.map((feature) => (
                <FeatureLink
                  key={feature.href}
                  label={feature.label}
                  href={feature.href}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Layout({
  title,
  children,
  sideNavItems = [],
  version,
}: LayoutProps) {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.colors.pageBackground,
        color: theme.colors.text,
        fontFamily: theme.fontFamily,
      }}
    >
      <header
        style={{
          backgroundColor: theme.colors.primary,
          color: theme.colors.primaryText,
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            userSelect: "none",
          }}
        >
          <span style={{ fontWeight: 700, fontSize: "18px" }}>iRMS</span>
          <span style={{ opacity: 0.4, fontWeight: 300 }}>|</span>
          <span style={{ fontSize: "16px", fontWeight: 400 }}>{title}</span>
        </div>
        {isAuthenticated && user && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ProfileMenu user={user} />
            <span
              style={{
                opacity: 0.3,
                fontWeight: 300,
                fontSize: "18px",
                margin: "0 4px",
              }}
            >
              |
            </span>
            <AppLauncher />
            <LogoutButton onLogout={logout} />
          </div>
        )}
      </header>
      <main
        style={{
          flex: 1,
          padding: "24px",
          maxWidth: theme.layout.contentMaxWidth,
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
          {sideNavItems.length > 0 && <SideNav items={sideNavItems} />}
          <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
        </div>
      </main>
      <footer
        style={{
          padding: "16px 24px",
          backgroundColor: theme.colors.surface,
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "13px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{ color: theme.colors.textMuted, whiteSpace: "nowrap" }}
            >
              ISARC Resource Management System
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "12px",
              color: theme.colors.textMuted,
            }}
          >
            {version && (
              <>
                <span style={{ fontStyle: "italic", opacity: 0.7 }}>
                  Version {version}
                </span>
                <span style={{ color: theme.colors.border, fontSize: "11px" }}>
                  |
                </span>
              </>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontWeight: 300 }}>Developed by</span>
              <span style={{ fontWeight: 500, color: theme.colors.text }}>
                Engine Team
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
