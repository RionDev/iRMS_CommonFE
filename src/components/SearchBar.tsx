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
        padding: "16px 24px",
        borderRadius: theme.radius.md,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadow.card,
        marginBottom: "16px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          alignItems: "center",
        }}
      >
        {children}
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
