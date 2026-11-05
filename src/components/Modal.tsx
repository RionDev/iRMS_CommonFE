import type { ReactNode } from "react";
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
        <h2
          style={{
            margin: "0 0 16px 0",
            fontSize: theme.fontSize.xl,
            color: theme.colors.text,
          }}
        >
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
