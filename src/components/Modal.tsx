import { type ReactNode, useEffect } from "react";
import { useThemeStore } from "../stores/themeStore";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** 본문 최대 너비. 기본 480px */
  maxWidth?: number | string;
  /** true 면 바깥 클릭·ESC 로 안 닫힘 — 입력 폼처럼 실수로 닫히면 안 되는 모달. 닫기(✕)·취소·저장 버튼으로만 */
  staticBackdrop?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 480,
  staticBackdrop = false,
}: ModalProps) {
  const { theme } = useThemeStore();

  // ESC 로 닫기 (열려 있을 때만)
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !staticBackdrop) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, staticBackdrop]);

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
      onClick={staticBackdrop ? undefined : onClose}
    >
      <div
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.md,
          padding: "24px",
          minWidth: "320px",
          maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
          maxHeight: "90vh",          // 내용이 화면보다 길면 모달 안에서 스크롤 (위아래 잘림 방지)
          overflowY: "auto",
          boxSizing: "border-box",
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
