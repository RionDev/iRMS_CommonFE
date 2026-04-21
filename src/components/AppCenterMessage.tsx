import type { CSSProperties, ReactNode } from "react";
import { useThemeStore } from "../stores/themeStore";

export interface AppCenterMessageProps {
  children: ReactNode;
  /** 추가 style 오버라이드 */
  style?: CSSProperties;
}

/**
 * 앱 영역(`<main>`) 전체의 중앙에 메시지를 표시한다.
 *
 * 페이지 전체가 placeholder 이거나 콘텐츠가 없을 때 사용한다
 * (예: "아직 서비스 하지 않습니다.", "준비 중인 화면입니다.").
 *
 * 테이블과 직접 연관된 메시지("로딩 중...", "계정이 없습니다.")는
 * `TableEmptyState` 를 쓴다.
 *
 * 자세한 정책은 `common/docs/layout.md` 참조.
 */
export function AppCenterMessage({ children, style }: AppCenterMessageProps) {
  const { theme } = useThemeStore();
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: theme.fontSize.xl,
        color: theme.colors.textMuted,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
