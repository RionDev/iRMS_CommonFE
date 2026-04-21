import type { ReactNode } from "react";
import { useThemeStore } from "../stores/themeStore";

export interface TableEmptyStateProps {
  children: ReactNode;
}

/**
 * TableBlock 의 바디 영역에 렌더되는 중앙 정렬 플레이스홀더.
 *
 * 로딩 중 / 결과 없음 등의 메시지를 테이블 블럭의 남는 공간 중앙에 표시한다.
 * `flex: 1` 로 thead 와 pagination 사이 공간을 채운다.
 */
export function TableEmptyState({ children }: TableEmptyStateProps) {
  const { theme } = useThemeStore();
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: theme.colors.textMuted,
        fontSize: theme.fontSize.base,
      }}
    >
      {children}
    </div>
  );
}
