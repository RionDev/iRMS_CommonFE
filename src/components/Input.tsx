import type { InputHTMLAttributes } from "react";
import { useThemeStore } from "../stores/themeStore";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  const { theme } = useThemeStore();
  return (
    <div style={{ marginBottom: "12px" }}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: "4px",
            fontSize: "14px",
            color: theme.colors.text,
          }}
        >
          {label}
        </label>
      )}
      <input
        style={{
          width: "100%",
          padding: "8px",
          border: `1px solid ${error ? theme.colors.danger : theme.colors.border}`,
          borderRadius: theme.radius.sm,
          fontSize: "14px",
          fontFamily: theme.fontFamily,
          boxSizing: "border-box",
          ...style,
        }}
        {...props}
      />
      {error && (
        <span style={{ color: theme.colors.danger, fontSize: "12px" }}>
          {error}
        </span>
      )}
    </div>
  );
}
