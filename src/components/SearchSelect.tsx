import type { SelectHTMLAttributes } from "react";
import { useThemeStore } from "../stores/themeStore";

type SearchSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function SearchSelect({ style, children, ...props }: SearchSelectProps) {
  const { theme } = useThemeStore();
  return (
    <select
      style={{
        padding: "8px",
        borderRadius: theme.radius.sm,
        border: `1px solid ${theme.colors.border}`,
        fontFamily: theme.fontFamily,
        fontSize: theme.fontSize.base,
        color: theme.colors.text,
        backgroundColor: theme.colors.surface,
        minWidth: "120px",
        ...style,
      }}
      {...props}
    >
      {children}
    </select>
  );
}
