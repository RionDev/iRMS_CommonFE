import type { ReactNode } from "react";
import { useThemeStore } from "../stores/themeStore";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
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
          maxWidth: "480px",
          fontFamily: theme.fontFamily,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            margin: "0 0 16px 0",
            fontSize: "18px",
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
