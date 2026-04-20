import type { ReactNode } from "react";
import { useEffect } from "react";
import { useThemeStore } from "../stores/themeStore";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  /** 드로어 너비. 기본 480px */
  width?: string;
  children: ReactNode;
}

/**
 * 오른쪽에서 슬라이드 인되는 오버레이 드로어.
 * 배경은 반투명 처리되고 클릭 시 닫힘. ESC도 닫힘.
 */
export function Drawer({ isOpen, onClose, width = "480px", children }: DrawerProps) {
  const { theme } = useThemeStore();

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: theme.colors.overlay,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 200ms ease",
          zIndex: 999,
        }}
      />
      {/* panel */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width,
          maxWidth: "100vw",
          backgroundColor: theme.colors.surface,
          color: theme.colors.text,
          fontFamily: theme.fontFamily,
          boxShadow: "-4px 0 16px rgba(0,0,0,0.15)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 250ms ease",
          zIndex: 1000,
          overflowY: "auto",
        }}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </aside>
    </>
  );
}
