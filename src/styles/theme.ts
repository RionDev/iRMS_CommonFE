export interface ThemeColors {
  pageBackground: string;
  surface: string;
  surfaceMuted: string;
  primary: string;
  primaryHover: string;
  primaryText: string;
  text: string;
  textMuted: string;
  border: string;
  borderStrong: string;
  danger: string;
  success: string;
  warning: string;
  overlay: string;
  sidebarBackground: string;
  sidebarText: string;
  sidebarTextMuted: string;
  sidebarActive: string;
  sidebarActiveText: string;
  sidebarHover: string;
  sidebarBorder: string;
}

export interface Theme {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  radius: { sm: string; md: string; lg: string };
  shadow: { card: string };
  layout: { contentMaxWidth: string; sideNavWidth: string };
  colors: ThemeColors;
}

const base = {
  fontFamily:
    "'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
  fontSize: {
    xs: "10px",   // footer, 미세 라벨
    sm: "12px",   // 에러 메시지, 테이블 보조
    base: "13px", // 본문/버튼/입력/테이블 셀
    lg: "14px",   // 서브 타이틀
    xl: "15px",   // 섹션 헤더
    xxl: "17px",  // 페이지 타이틀
  },
  radius: { sm: "4px", md: "8px", lg: "12px" },
  shadow: { card: "0 1px 2px rgba(15,23,42,0.06), 0 1px 3px rgba(15,23,42,0.08)" },
  layout: { contentMaxWidth: "1400px", sideNavWidth: "220px" },
};

// Tailwind SaaS admin 팔레트 (slate + blue)
export const lightTheme: Theme = {
  ...base,
  colors: {
    pageBackground: "#f8fafc",   // slate-50
    surface: "#ffffff",           // white
    surfaceMuted: "#f1f5f9",      // slate-100 — 테이블 헤더/보조 카드
    primary: "#2563eb",           // blue-600
    primaryHover: "#1d4ed8",      // blue-700
    primaryText: "#ffffff",
    text: "#0f172a",              // slate-900
    textMuted: "#94a3b8",         // slate-400
    border: "#e2e8f0",            // slate-200
    borderStrong: "#cbd5e1",      // slate-300
    danger: "#dc2626",            // red-600
    success: "#059669",           // emerald-600
    warning: "#f59e0b",           // amber-500
    overlay: "rgba(15,23,42,0.5)",
    sidebarBackground: "#0f172a", // slate-900
    sidebarText: "#e2e8f0",       // slate-200
    sidebarTextMuted: "#94a3b8",  // slate-400
    sidebarActive: "#2563eb",     // blue-600
    sidebarActiveText: "#ffffff",
    sidebarHover: "#1e293b",      // slate-800
    sidebarBorder: "#1e293b",     // slate-800
  },
};

// Tailwind SaaS admin 다크 팔레트 (layered slate + blue)
export const darkTheme: Theme = {
  ...base,
  colors: {
    pageBackground: "#020617",   // slate-950
    surface: "#0f172a",           // slate-900 — 카드/콘텐츠 기본 면
    surfaceMuted: "#1e293b",      // slate-800 — elevated(드롭다운/테이블 hover)
    primary: "#2563eb",           // blue-600
    primaryHover: "#3b82f6",      // blue-500 (다크에서는 hover가 밝아짐)
    primaryText: "#ffffff",
    text: "#f8fafc",              // slate-50
    textMuted: "#94a3b8",         // slate-400
    border: "#1e293b",            // slate-800
    borderStrong: "#334155",      // slate-700
    danger: "#dc2626",            // red-600
    success: "#059669",           // emerald-600
    warning: "#f59e0b",           // amber-500
    overlay: "rgba(2,6,23,0.7)",  // slate-950 기반 오버레이
    sidebarBackground: "#020617", // slate-950
    sidebarText: "#e2e8f0",       // slate-200
    sidebarTextMuted: "#64748b",  // slate-500
    sidebarActive: "#2563eb",     // blue-600
    sidebarActiveText: "#ffffff",
    sidebarHover: "#1e293b",      // slate-800
    sidebarBorder: "#1e293b",     // slate-800
  },
};

/** @deprecated useThemeStore().theme 사용 권장 */
export const theme = lightTheme;
