import type { InputHTMLAttributes } from "react";
import { useThemeStore } from "../stores/themeStore";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement>;

export function SearchInput({ style, type = "text", ...props }: SearchInputProps) {
  const { theme } = useThemeStore();
  return (
    <input
      type={type}
      style={{
        padding: "8px",
        borderRadius: theme.radius.sm,
        border: `1px solid ${theme.colors.border}`,
        fontFamily: theme.fontFamily,
        fontSize: theme.fontSize.base,
        color: theme.colors.text,
        backgroundColor: theme.colors.surface,
        boxSizing: "border-box",
        minWidth: "140px",
        ...style,
      }}
      {...props}
    />
  );
}
