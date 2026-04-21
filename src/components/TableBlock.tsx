import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { useThemeStore } from "../stores/themeStore";

export interface TableBlockProps {
  children: ReactNode;
  /** 기본 "16px 20px". */
  padding?: string;
  /** 추가 스타일 오버라이드. 기본 스타일을 덮어씀. */
  style?: CSSProperties;
}

/**
 * 페이지네이션 테이블을 감싸는 공통 블럭.
 *
 * - flex column + `flex: 1` 로 부모 flex 컨테이너에서 남는 공간을 차지
 * - 카드 스타일(surface 배경, border, radius, shadow)
 * - `overflow: hidden` 으로 측정 오차나 비정상 렌더 시 자식 오버플로우 클리핑
 * - forwardRef 로 `useDynamicPageSize` 에 전달할 수 있게 지원
 */
export const TableBlock = forwardRef<HTMLDivElement, TableBlockProps>(
  function TableBlock({ children, padding = "16px 20px", style }, ref) {
    const { theme } = useThemeStore();
    return (
      <div
        ref={ref}
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          backgroundColor: theme.colors.surface,
          padding,
          borderRadius: theme.radius.md,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadow.card,
          overflow: "hidden",
          ...style,
        }}
      >
        {children}
      </div>
    );
  },
);
