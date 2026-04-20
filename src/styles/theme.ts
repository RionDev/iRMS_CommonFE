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
  shadow: { card: "0 2px 8px rgba(0,0,0,0.1)" },
  layout: { contentMaxWidth: "1400px", sideNavWidth: "220px" },
};

export const lightTheme: Theme = {
  ...base,
  colors: {
    pageBackground: "#f5f5f5",
    surface: "#ffffff",
    surfaceMuted: "#e0e0e0",
    primary: "#1976d2",
    primaryHover: "#1565c0",
    primaryText: "#ffffff",
    text: "#1f2937",
    textMuted: "#666666",
    border: "#d1d5db",
    borderStrong: "#b6c2cf",
    danger: "#d32f2f",
    success: "#2e7d32",
    warning: "#ed6c02",
    overlay: "rgba(0,0,0,0.5)",
    sidebarBackground: "#1e293b",
    sidebarText: "#e2e8f0",
    sidebarTextMuted: "#94a3b8",
    sidebarActive: "#1976d2",
    sidebarActiveText: "#ffffff",
    sidebarHover: "rgba(255,255,255,0.08)",
    sidebarBorder: "rgba(255,255,255,0.08)",
  },
};

export const darkTheme: Theme = {
  ...base,
  colors: {
    pageBackground: "#121212",
    surface: "#1e1e1e",
    surfaceMuted: "#2c2c2c",
    primary: "#64b5f6",
    primaryHover: "#42a5f5",
    primaryText: "#121212",
    text: "#e0e0e0",
    textMuted: "#9e9e9e",
    border: "#424242",
    borderStrong: "#616161",
    danger: "#ef5350",
    success: "#66bb6a",
    warning: "#ffa726",
    overlay: "rgba(0,0,0,0.7)",
    sidebarBackground: "#0f172a",
    sidebarText: "#e2e8f0",
    sidebarTextMuted: "#94a3b8",
    sidebarActive: "#1976d2",
    sidebarActiveText: "#ffffff",
    sidebarHover: "rgba(255,255,255,0.08)",
    sidebarBorder: "rgba(255,255,255,0.06)",
  },
};

/** @deprecated useThemeStore().theme 사용 권장 */
export const theme = lightTheme;
