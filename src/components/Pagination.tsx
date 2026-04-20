import type { ChangeEvent } from "react";
import { useThemeStore } from "../stores/themeStore";

export interface PaginationProps {
  /** 현재 페이지 번호 (1-base) */
  page: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 전체 항목 수 */
  total: number;
  /** 이전 페이지 이동 가능 여부 */
  hasPrev: boolean;
  /** 다음 페이지 이동 가능 여부 */
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  loading?: boolean;
  /** 페이지당 항목 수. 드롭다운을 활성화하려면 함께 size/onSizeChange/sizeOptions 제공 */
  size?: number;
  sizeOptions?: number[];
  onSizeChange?: (size: number) => void;
}

/**
 * 이전/다음 + 페이지 번호 표시 네비게이션 컴포넌트.
 *
 * `usePagedNav` 훅의 반환값과 연결해 사용한다.
 * total=0일 때는 아무것도 렌더하지 않는다.
 */
export function Pagination({
  page,
  totalPages,
  total,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  loading,
  size,
  sizeOptions,
  onSizeChange,
}: PaginationProps) {
  const { theme } = useThemeStore();

  if (total === 0) return null;

  const showSizeSelector = size !== undefined && sizeOptions && onSizeChange;

  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "12px 0",
    fontFamily: theme.fontFamily,
    fontSize: "14px",
    color: theme.colors.text,
  };

  const buttonStyle = (disabled: boolean): React.CSSProperties => ({
    padding: "6px 12px",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    fontSize: "14px",
    fontFamily: theme.fontFamily,
  });

  const selectStyle: React.CSSProperties = {
    padding: "6px 8px",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontSize: "14px",
    fontFamily: theme.fontFamily,
    cursor: "pointer",
  };

  const infoStyle: React.CSSProperties = {
    minWidth: "120px",
    textAlign: "center",
    color: theme.colors.textMuted,
  };

  const handleSize = (e: ChangeEvent<HTMLSelectElement>) => {
    onSizeChange?.(Number(e.target.value));
  };

  const prevDisabled = !hasPrev || !!loading;
  const nextDisabled = !hasNext || !!loading;

  return (
    <div style={containerStyle}>
      <button
        type="button"
        onClick={onPrev}
        disabled={prevDisabled}
        style={buttonStyle(prevDisabled)}
      >
        {"< 이전"}
      </button>
      <span style={infoStyle}>
        {page} / {totalPages} (총 {total.toLocaleString()}건)
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        style={buttonStyle(nextDisabled)}
      >
        {"다음 >"}
      </button>
      {showSizeSelector && (
        <select value={size} onChange={handleSize} style={selectStyle} disabled={loading}>
          {sizeOptions.map((n) => (
            <option key={n} value={n}>
              {n}개
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
