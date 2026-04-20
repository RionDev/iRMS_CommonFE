import type { ButtonHTMLAttributes } from "react";
import { useState } from "react";
import { useThemeStore } from "../stores/themeStore";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({
  variant = "primary",
  children,
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  ...props
}: ButtonProps) {
  const { theme } = useThemeStore();
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const disabled = props.disabled;
  const interactive = !disabled && hover;

  const background =
    variant === "primary"
      ? interactive
        ? theme.colors.primaryHover
        : theme.colors.primary
      : interactive
        ? theme.colors.border
        : theme.colors.surfaceMuted;

  const color =
    variant === "primary" ? theme.colors.primaryText : theme.colors.text;

  const baseStyle: React.CSSProperties = {
    padding: "8px 16px",
    border: "none",
    borderRadius: theme.radius.sm,
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: theme.fontSize.base,
    fontFamily: theme.fontFamily,
    opacity: disabled ? 0.6 : 1,
    backgroundColor: background,
    color,
    transition:
      "background-color 0.15s ease, transform 0.12s ease, box-shadow 0.15s ease",
    transform: interactive && !pressed ? "translateY(-1px)" : "translateY(0)",
    boxShadow:
      interactive && !pressed
        ? "0 2px 6px rgba(15,23,42,0.12)"
        : "0 0 0 rgba(0,0,0,0)",
    ...style,
  };

  return (
    <button
      style={baseStyle}
      onMouseEnter={(e) => {
        setHover(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHover(false);
        setPressed(false);
        onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        setPressed(true);
        onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        setPressed(false);
        onMouseUp?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
