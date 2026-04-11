import { type ReactNode, type FormEvent, useState, useRef, useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { theme } from "../styles/theme";
import { Modal } from "./Modal";
import { Input } from "./Input";
import { Button } from "./Button";
import apiClient from "../services/apiClient";
import type { SideNavItem } from "./SideNav";
import { SideNav } from "./SideNav";

interface LayoutProps {
  title: string;
  children: ReactNode;
  sideNavItems?: SideNavItem[];
  version?: string;
}

const RoleLabel: Record<number, string> = { 1: "멤버", 2: "리드", 3: "관리자", 4: "게스트" };
const TeamLabel: Record<number, string> = { 1: "엔진팀", 2: "분석팀" };

function ChangePasswordModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      await apiClient.post("/api/auth/change-password", {
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
          <p style={{ color: theme.colors.success, fontSize: "14px", margin: "8px 0 16px" }}>비밀번호가 변경되었습니다.</p>
          <Button type="button" onClick={handleClose} style={{ width: "100%" }}>확인</Button>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <Input label="현재 비밀번호" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            <Input label="새 비밀번호" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <Input label="새 비밀번호 확인" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <Button type="submit" style={{ width: "100%", marginTop: "8px" }}>변경하기</Button>
          </form>
          {error && <p style={{ color: theme.colors.danger, marginTop: "12px", fontSize: "14px" }}>{error}</p>}
        </>
      )}
    </Modal>
  );
}

function ProfileMenu({ user, onLogout }: { user: { id: string; name: string; role: number; team: number }; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "none",
          border: "none",
          color: theme.colors.primaryText,
          cursor: "pointer",
          fontSize: "14px",
          fontFamily: theme.fontFamily,
          padding: "4px 8px",
          borderRadius: theme.radius.sm,
        }}
      >
        {user.name} ▾
      </button>
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
          <div style={{ padding: "16px", borderBottom: `1px solid ${theme.colors.border}` }}>
            <div style={{ fontWeight: 600, fontSize: "15px", marginBottom: "4px" }}>{user.name}</div>
            <div style={{ fontSize: "13px", color: theme.colors.textMuted }}>{user.id}</div>
            <div style={{ fontSize: "13px", color: theme.colors.textMuted, marginTop: "4px" }}>
              {user.team ? `${TeamLabel[user.team] ?? `팀 ${user.team}`} · ` : ""}{RoleLabel[user.role] ?? `역할 ${user.role}`}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", padding: "12px 16px" }}>
            <button
              onClick={() => { setOpen(false); setPwModalOpen(true); }}
              style={{
                flex: 1,
                background: "none",
                border: `1px solid ${theme.colors.border}`,
                padding: "6px 12px",
                borderRadius: theme.radius.sm,
                cursor: "pointer",
                fontSize: "13px",
                fontFamily: theme.fontFamily,
                color: theme.colors.text,
              }}
            >
              비밀번호 변경
            </button>
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              style={{
                flex: 1,
                background: "none",
                border: `1px solid ${theme.colors.danger}`,
                padding: "6px 12px",
                borderRadius: theme.radius.sm,
                cursor: "pointer",
                fontSize: "13px",
                fontFamily: theme.fontFamily,
                color: theme.colors.danger,
              }}
            >
              로그아웃
            </button>
          </div>
        </div>
      )}
      <ChangePasswordModal isOpen={pwModalOpen} onClose={() => setPwModalOpen(false)} />
    </div>
  );
}

export function Layout({ title, children, sideNavItems = [], version }: LayoutProps) {
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
        <h1 style={{ margin: 0, fontSize: "18px" }}>iRMS — {title}</h1>
        {isAuthenticated && user && (
          <ProfileMenu user={user} onLogout={logout} />
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
            <span style={{ fontWeight: 700, color: theme.colors.text }}>iRMS</span>
            <span style={{ color: theme.colors.border, fontWeight: 300 }}>|</span>
            <span style={{ color: theme.colors.textMuted, whiteSpace: "nowrap" }}>
              ISARC Resource Management System
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: theme.colors.textMuted }}>
            {version && (
              <>
                <span style={{ fontStyle: "italic", opacity: 0.7 }}>Version {version}</span>
                <span style={{ color: theme.colors.border, fontSize: "11px" }}>|</span>
              </>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontWeight: 300 }}>Developed by</span>
              <span style={{ fontWeight: 500, color: theme.colors.text }}>Engine Team</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
