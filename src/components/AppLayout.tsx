import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { NavLink, useLocation } from "react-router-dom";
import apiClient from "../services/apiClient";
import { useAppsStore } from "../stores/appsStore";
import { useAuthStore } from "../stores/authStore";
import { useThemeStore } from "../stores/themeStore";
import type { AuthPayload } from "../types/auth";
import { ROLE_LABEL, TEAM_LABEL } from "../types/constants";
import { hasAppAccess } from "../utils/appPath";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { Input } from "./Input";
import { Modal } from "./Modal";

export interface SidebarLeaf {
  label: string;
  to: string;
  icon?: ReactNode;
}

export interface SidebarGroup {
  label: string;
  icon?: ReactNode;
  children: SidebarLeaf[];
}

export type SidebarItem = SidebarLeaf | SidebarGroup;

function isGroup(item: SidebarItem): item is SidebarGroup {
  return "children" in item;
}

function pathMatchesLeaf(pathname: string, to: string): boolean {
  return pathname === to || pathname.endsWith(to);
}

function findActiveGroup(
  pathname: string,
  items: SidebarItem[],
): SidebarGroup | undefined {
  for (const item of items) {
    if (isGroup(item) && item.children.some((c) => pathMatchesLeaf(pathname, c.to))) {
      return item;
    }
  }
  return undefined;
}

const SIDEBAR_COLLAPSED_KEY = "IRMS_SIDEBAR_COLLAPSED";

function getInitialCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
  } catch {
    return false;
  }
}

interface AppLayoutProps {
  /**
   * 헤더에 `{appName} | {title}` 형태로 표시되는 현재 페이지 이름.
   * 생략하거나 빈 문자열이면 구분자와 함께 숨겨져 `{appName}`만 표시된다
   * (예: 포털처럼 단일 랜딩 페이지).
   */
  title?: string;
  /** 사이드바 상단 앱 이름 (예: "ADMIN", "PORTAL") */
  appName: string;
  /** 사이드바 메뉴 항목. 빈 배열이면 메뉴 없이 브랜드 + 로그아웃만 표시. */
  sidebarItems?: SidebarItem[];
  /** 하단 푸터 버전 표시 */
  version?: string;
  /**
   * 메인 콘텐츠 영역 최대 너비. 기본 "960px" (FHD 해상도에서 브라우저가
   * 화면 절반을 사용할 때 꽉 차는 크기).
   * 좌측 정렬되므로 초과분은 사이드바 반대편(우측)에 여백으로 남는다.
   * 가변 (예: "100%") 또는 명시적 값 ("1200px") 지정 가능.
   */
  contentMaxWidth?: string;
  /**
   * 앱 전체 최소 너비. 기본 "1180px" (사이드바 220 + 메인 960).
   * 브라우저 너비가 이 값보다 작으면 페이지에 가로 스크롤이 생기며
   * 앱/테이블 등 콘텐츠는 줄어들지 않는다.
   */
  appMinWidth?: string;
  children: ReactNode;
}

interface AppNavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const APP_NAV_ICON_PROPS = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const APP_NAV: AppNavItem[] = [
  {
    label: "샘플",
    href: "/sample/",
    icon: (
      <svg {...APP_NAV_ICON_PROPS}>
        <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2" />
        <path d="M8.5 2h7" />
        <path d="M14.5 16h-5" />
      </svg>
    ),
  },
  {
    label: "패턴",
    href: "/pattern/",
    icon: (
      <svg {...APP_NAV_ICON_PROPS}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    label: "빌드",
    href: "/build/",
    icon: (
      <svg {...APP_NAV_ICON_PROPS}>
        <path d="m15 12-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9" />
        <path d="M17.64 15 22 10.64" />
        <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91" />
      </svg>
    ),
  },
  {
    label: "업데이트",
    href: "/update/",
    icon: (
      <svg {...APP_NAV_ICON_PROPS}>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M3 21v-5h5" />
      </svg>
    ),
  },
  {
    label: "서버",
    href: "/server/",
    icon: (
      <svg {...APP_NAV_ICON_PROPS}>
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
  },
  {
    label: "통계",
    href: "/statistics/",
    icon: (
      <svg {...APP_NAV_ICON_PROPS}>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    label: "위협정보",
    href: "/threat/",
    icon: (
      <svg {...APP_NAV_ICON_PROPS}>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    label: "전용 백신",
    href: "/vaccine/",
    icon: (
      <svg {...APP_NAV_ICON_PROPS}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    label: "관리자",
    href: "/admin/",
    icon: (
      <svg {...APP_NAV_ICON_PROPS}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export function ChangePasswordModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { theme } = useThemeStore();
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
    if (currentPassword === newPassword) {
      setError("새 비밀번호는 현재 비밀번호와 달라야 합니다.");
      return;
    }
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
              fontSize: theme.fontSize.base,
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
                fontSize: theme.fontSize.base,
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

function PwChangeButton({ onClick }: { onClick: () => void }) {
  const { theme } = useThemeStore();
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "10px 16px",
        border: "none",
        background: hover ? theme.colors.surfaceMuted : "transparent",
        color: theme.colors.textMuted,
        cursor: "pointer",
        fontSize: theme.fontSize.base,
        fontWeight: 500,
        fontFamily: theme.fontFamily,
        borderRadius: theme.radius.sm,
        transition: "background-color 0.2s ease, color 0.2s ease",
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      비밀번호 변경
    </button>
  );
}

function HeaderIconButton({
  onClick,
  tooltip,
  children,
}: {
  onClick: () => void;
  tooltip: string;
  children: ReactNode;
}) {
  const { theme } = useThemeStore();
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        onClick={onClick}
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
        {children}
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
            fontSize: theme.fontSize.sm,
            padding: "4px 10px",
            borderRadius: theme.radius.sm,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}

function ThemeToggle() {
  const { theme, isDarkMode, toggleDarkMode } = useThemeStore();
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        onClick={toggleDarkMode}
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
        {isDarkMode ? (
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
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
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
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
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
            fontSize: theme.fontSize.sm,
            padding: "4px 10px",
            borderRadius: theme.radius.sm,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {isDarkMode ? "라이트 모드" : "다크 모드"}
        </div>
      )}
    </div>
  );
}

function AppTile({ app }: { app: AppNavItem }) {
  const { theme } = useThemeStore();
  const [hover, setHover] = useState(false);
  const isActive = window.location.pathname.startsWith(app.href);

  return (
    <a
      href={app.href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
        padding: "6px 4px",
        borderRadius: theme.radius.sm,
        textDecoration: "none",
        color: isActive ? theme.colors.primary : theme.colors.text,
        backgroundColor: hover ? theme.colors.pageBackground : "transparent",
        transition: "background-color 0.15s",
        cursor: "pointer",
      }}
    >
      {app.icon}
      <span
        style={{
          fontSize: theme.fontSize.xs,
          fontWeight: isActive ? 600 : 400,
          textAlign: "center",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {app.label}
      </span>
    </a>
  );
}

function AppLauncher() {
  const { theme } = useThemeStore();
  const [open, setOpen] = useState(false);
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

  const visibleApps = APP_NAV.filter((app) => hasAppAccess(apps, app.href));

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <HeaderIconButton onClick={() => setOpen((v) => !v)} tooltip="앱">
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
      </HeaderIconButton>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: theme.colors.surface,
            color: theme.colors.text,
            borderRadius: theme.radius.md,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            zIndex: 1000,
            padding: "6px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0px",
          }}
        >
          {visibleApps.map((app) => (
            <AppTile key={app.href} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileMenu({
  user,
}: {
  user: AuthPayload;
}) {
  const { theme } = useThemeStore();
  const [open, setOpen] = useState(false);
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      ref={ref}
      style={{ position: "relative" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        title={`${user.name} 님`}
        aria-label={`${user.name} 님 프로필 메뉴`}
        style={{
          background: hover || open ? "rgba(255,255,255,0.15)" : "none",
          border: "none",
          cursor: "pointer",
          padding: "4px",
          borderRadius: "50%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.15s",
        }}
      >
        <Avatar name={user.name} size={32} />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: theme.colors.surface,
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
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Avatar name={user.name} size={48} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                minWidth: 0,
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: theme.fontSize.lg,
                  color: theme.colors.text,
                }}
              >
                {user.name}
              </span>
              {user.team && (
                <span
                  style={{ fontSize: theme.fontSize.base, color: theme.colors.textMuted }}
                >
                  {TEAM_LABEL[user.team]}
                </span>
              )}
              <span
                style={{ fontSize: theme.fontSize.base, color: theme.colors.textMuted }}
              >
                {ROLE_LABEL[user.role] ?? user.role}
              </span>
            </div>
          </div>
          <div style={{ padding: "8px" }}>
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

function SidebarNavItem({
  item,
  collapsed,
  indented = false,
}: {
  item: SidebarLeaf;
  collapsed: boolean;
  indented?: boolean;
}) {
  const { theme } = useThemeStore();
  const [hover, setHover] = useState(false);
  const leftPad = collapsed ? 0 : indented ? 24 : 12;

  return (
    <NavLink
      to={item.to}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={collapsed ? item.label : undefined}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: collapsed ? "10px 0" : `10px 12px 10px ${leftPad}px`,
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: theme.radius.sm,
        textDecoration: "none",
        fontSize: theme.fontSize.base,
        fontWeight: 500,
        color: isActive
          ? theme.colors.sidebarActiveText
          : theme.colors.sidebarText,
        backgroundColor: isActive
          ? theme.colors.sidebarActive
          : hover
            ? theme.colors.sidebarHover
            : "transparent",
        transition: "background-color 0.2s ease, color 0.2s ease",
      })}
    >
      {item.icon && (
        <span style={{ display: "inline-flex", alignItems: "center" }}>
          {item.icon}
        </span>
      )}
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );
}

function SidebarNavGroup({
  group,
  collapsed,
}: {
  group: SidebarGroup;
  collapsed: boolean;
}) {
  const { theme } = useThemeStore();
  const { pathname } = useLocation();
  const [hover, setHover] = useState(false);

  if (group.children.length === 0) return null;

  const first = group.children[0];
  const isActive = group.children.some((c) => pathMatchesLeaf(pathname, c.to));

  if (collapsed) {
    return (
      <>
        {group.children.map((child) => (
          <SidebarNavItem key={child.to} item={child} collapsed />
        ))}
      </>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <NavLink
        to={first.to}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "8px 12px",
          borderRadius: theme.radius.sm,
          textDecoration: "none",
          fontSize: theme.fontSize.sm,
          fontWeight: 700,
          letterSpacing: "0.02em",
          color: isActive
            ? theme.colors.sidebarActiveText
            : theme.colors.sidebarTextMuted,
          backgroundColor: hover ? theme.colors.sidebarHover : "transparent",
          transition: "background-color 0.2s ease, color 0.2s ease",
        }}
      >
        {group.icon && (
          <span style={{ display: "inline-flex", alignItems: "center" }}>
            {group.icon}
          </span>
        )}
        <span>{group.label}</span>
      </NavLink>
      {group.children.map((child) => (
        <SidebarNavItem
          key={child.to}
          item={child}
          collapsed={false}
          indented
        />
      ))}
    </div>
  );
}

function SidebarLogoutButton({
  collapsed,
  onLogout,
}: {
  collapsed: boolean;
  onLogout: () => void;
}) {
  const { theme } = useThemeStore();
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onLogout}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={collapsed ? "로그아웃" : undefined}
      style={{
        width: "100%",
        height: "36px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: collapsed ? "0" : "0 12px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: theme.radius.sm,
        border: "none",
        background: hover ? theme.colors.sidebarHover : "transparent",
        color: theme.colors.sidebarTextMuted,
        cursor: "pointer",
        fontSize: theme.fontSize.base,
        fontFamily: theme.fontFamily,
        transition: "background-color 0.2s ease, color 0.2s ease",
      }}
    >
      <svg
        width="18"
        height="18"
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
      {!collapsed && <span>로그아웃</span>}
    </button>
  );
}

function SidebarToggleButton({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { theme } = useThemeStore();
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={collapsed ? "메뉴 열기" : "메뉴 접기"}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px",
        borderRadius: theme.radius.sm,
        border: "none",
        background: hover ? theme.colors.sidebarHover : "transparent",
        color: theme.colors.sidebarText,
        cursor: "pointer",
        transition: "background-color 0.2s ease",
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
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <line x1="9" x2="9" y1="3" y2="21" />
        {collapsed ? (
          <path d="m14 9 3 3-3 3" />
        ) : (
          <path d="m16 15-3-3 3-3" />
        )}
      </svg>
    </button>
  );
}

function Sidebar({
  items,
  collapsed,
  onToggle,
  onLogout,
}: {
  items: SidebarItem[];
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
}) {
  const { theme } = useThemeStore();

  const width = collapsed ? "64px" : "220px";

  return (
    <aside
      style={{
        width,
        flexShrink: 0,
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        height: "100vh",
        backgroundColor: theme.colors.sidebarBackground,
        color: theme.colors.sidebarText,
        borderRight: `1px solid ${theme.colors.sidebarBorder}`,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "0 8px",
          borderBottom: `1px solid ${theme.colors.sidebarBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: "4px",
          height: "64px",
          boxSizing: "border-box",
        }}
      >
        {!collapsed && (
          <a
            href="/"
            title="포털로 이동"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: theme.colors.sidebarText,
              textDecoration: "none",
              borderRadius: theme.radius.sm,
              padding: "10px 12px",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                theme.colors.sidebarHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            <span
              style={{
                fontWeight: 700,
                fontSize: theme.fontSize.xxl,
              }}
            >
              IRMS
            </span>
          </a>
        )}
        <SidebarToggleButton collapsed={collapsed} onToggle={onToggle} />
      </div>

      <nav
        style={{
          flex: 1,
          padding: "12px 8px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {items.map((item) =>
          isGroup(item) ? (
            <SidebarNavGroup
              key={item.label}
              group={item}
              collapsed={collapsed}
            />
          ) : (
            <SidebarNavItem key={item.to} item={item} collapsed={collapsed} />
          ),
        )}
      </nav>

      <div
        style={{
          padding: "0 8px",
          borderTop: `1px solid ${theme.colors.sidebarBorder}`,
          height: "48px",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <SidebarLogoutButton collapsed={collapsed} onLogout={onLogout} />
      </div>
    </aside>
  );
}

export function AppLayout({
  title,
  appName,
  sidebarItems = [],
  version,
  contentMaxWidth = "1400px",
  appMinWidth = "1180px",
  children,
}: AppLayoutProps) {
  const { theme } = useThemeStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState<boolean>(getInitialCollapsed);
  const { pathname } = useLocation();
  const activeGroup = findActiveGroup(pathname, sidebarItems);

  const toggleCollapsed = () => {
    setCollapsed((v) => {
      const next = !v;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: appMinWidth,
        display: "flex",
        backgroundColor: theme.colors.pageBackground,
        color: theme.colors.text,
        fontFamily: theme.fontFamily,
      }}
    >
      <Sidebar
        items={sidebarItems}
        collapsed={collapsed}
        onToggle={toggleCollapsed}
        onLogout={logout}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: theme.colors.primary,
            color: theme.colors.primaryText,
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "64px",
            flexShrink: 0,
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
            <span style={{ fontWeight: 700, fontSize: theme.fontSize.xxl }}>
              {appName}
            </span>
            {activeGroup && (
              <>
                <span
                  style={{
                    opacity: 0.4,
                    fontWeight: 300,
                    fontSize: theme.fontSize.xxl,
                  }}
                >
                  |
                </span>
                <span style={{ fontSize: theme.fontSize.xxl, fontWeight: 400 }}>
                  {activeGroup.label}
                </span>
              </>
            )}
            {title && (
              <>
                <span
                  style={{
                    opacity: 0.4,
                    fontWeight: 300,
                    fontSize: theme.fontSize.xxl,
                  }}
                >
                  |
                </span>
                <span style={{ fontSize: theme.fontSize.xxl, fontWeight: 400 }}>
                  {title}
                </span>
              </>
            )}
          </div>
          {isAuthenticated && user && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AppLauncher />
              <ThemeToggle />
              <span
                style={{
                  opacity: 0.3,
                  fontWeight: 300,
                  fontSize: theme.fontSize.xxl,
                  margin: "0 4px",
                }}
              >
                |
              </span>
              <ProfileMenu user={user} />
            </div>
          )}
        </header>

        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "24px",
            maxWidth: contentMaxWidth,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {children}
        </main>

        <footer
          style={{
            padding: "0 24px",
            backgroundColor: theme.colors.surface,
            borderTop: `1px solid ${theme.colors.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: theme.fontSize.sm,
            height: "48px",
            flexShrink: 0,
            userSelect: "none",
          }}
        >
          <span style={{ color: theme.colors.textMuted }}>
            iRMS - ISARC Resource Management System
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: theme.colors.textMuted,
            }}
          >
            {version && (
              <>
                <span style={{ fontStyle: "italic", opacity: 0.7 }}>
                  Version {version}
                </span>
                <span style={{ color: theme.colors.border }}>|</span>
              </>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontWeight: 300 }}>Powered by</span>
              <span style={{ fontWeight: 500, color: theme.colors.text }}>
                Engine Team
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
