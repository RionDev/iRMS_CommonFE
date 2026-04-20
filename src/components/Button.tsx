import type { ButtonHTMLAttributes } from "react";
import { useThemeStore } from "../stores/themeStore";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({
  variant = "primary",
  children,
  style,
  ...props
}: ButtonProps) {
  const { theme } = useThemeStore();
  const baseStyle: React.CSSProperties = {
    padding: "8px 16px",
    border: "none",
    borderRadius: theme.radius.sm,
    cursor: props.disabled ? "not-allowed" : "pointer",
    fontSize: theme.fontSize.base,
    fontFamily: theme.fontFamily,
    opacity: props.disabled ? 0.6 : 1,
    ...(variant === "primary"
      ? {
          backgroundColor: theme.colors.primary,
          color: theme.colors.primaryText,
        }
      : {
          backgroundColor: theme.colors.surfaceMuted,
          color: theme.colors.text,
        }),
    ...style,
  };

  return (
    <button style={baseStyle} {...props}>
      {children}
    </button>
  );
}
