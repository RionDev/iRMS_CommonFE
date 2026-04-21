import type { FormEvent, ReactNode } from "react";
import { useThemeStore } from "../stores/themeStore";
import { Button } from "./Button";

interface SearchBarProps {
  onSearch: () => void;
  onReset?: () => void;
  children: ReactNode;
}

export function SearchBar({ onSearch, onReset, children }: SearchBarProps) {
  const { theme } = useThemeStore();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div
      style={{
        backgroundColor: theme.colors.surface,
        height: "72px",
        padding: "16px 24px",
        borderRadius: theme.radius.md,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadow.card,
        marginBottom: "16px",
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            minWidth: 0,
            gap: "8px",
            alignItems: "center",
          }}
        >
          {children}
        </div>
        <span
          aria-hidden
          style={{
            width: "1px",
            height: "24px",
            backgroundColor: theme.colors.border,
            margin: "0 4px",
          }}
        />
        <Button type="submit">검색</Button>
        {onReset && (
          <Button type="button" variant="secondary" onClick={onReset}>
            초기화
          </Button>
        )}
      </form>
    </div>
  );
}
