export const theme = {
  fontFamily:
    "'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
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
  },
  radius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
  },
  shadow: {
    card: "0 2px 8px rgba(0,0,0,0.1)",
  },
  layout: {
    contentMaxWidth: "1120px",
    sideNavWidth: "220px",
  },
} as const;
