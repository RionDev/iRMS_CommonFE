import { type ReactNode, useEffect } from "react";
import { useThemeStore } from "../stores/themeStore";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** 본문 최대 너비. 기본 480px */
  maxWidth?: number | string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 480,
}: ModalProps) {
  const { theme } = useThemeStore();

  // ESC 로 닫기 (열려 있을 때만)
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: theme.colors.overlay,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.md,
          padding: "24px",
          minWidth: "320px",
          maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
          fontFamily: theme.fontFamily,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", margin: "0 0 16px 0" }}>
          <h2 style={{ margin: 0, flex: 1, fontSize: theme.fontSize.xl, color: theme.colors.text }}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            title="닫기 (Esc)"
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              color: theme.colors.textMuted,
              fontSize: theme.fontSize.xl,
              lineHeight: 1,
              padding: "2px 4px",
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
