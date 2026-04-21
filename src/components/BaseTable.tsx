import type { CSSProperties, ReactNode } from "react";
import { useThemeStore } from "../stores/themeStore";

/** compact 모드 tbody row 고정 높이. useFixedPageSize 의 rowHeight 와 일치해야 함. */
export const TABLE_ROW_H_COMPACT = 40;
/** 일반 모드 tbody row 고정 높이. */
export const TABLE_ROW_H_NORMAL = 44;
/** thead 고정 높이. useFixedPageSize 의 overhead 계산에 쓰인다. */
export const TABLE_THEAD_H = 40;

export interface TableColumn<T> {
  /** 고유 키. React key 및 기본 value lookup 에 사용. */
  key: string;
  /** thead 에 표시할 컬럼명. */
  label: string;
  /** 셀 컨텐츠 커스텀 렌더. 미지정 시 `(item as any)[key]` 를 그대로 출력. */
  render?: (item: T) => ReactNode;
  /** 개별 td 스타일 오버라이드 (예: display flex + gap 등). */
  cellStyle?: CSSProperties;
}

export interface BaseTableProps<T> {
  items: T[];
  columns: TableColumn<T>[];
  /** 행 클릭 콜백. 셀 내부 인터랙티브 요소에선 `e.stopPropagation()` 필요. */
  onRowClick?: (item: T) => void;
  /** React key 추출. 기본값은 `(item as any).idx`. */
  rowKey?: (item: T) => string | number;
  /** compact 모드: 셀 padding 좁히고 텍스트 중앙 정렬, row 높이 40px. */
  compact?: boolean;
}

/**
 * 테이블의 공통 셸 컴포넌트.
 *
 * 행의 데이터 구조(T)와 컬럼 목록을 인자로 받아 thead/tbody 를 그려준다.
 * 카드형 블럭(`TableBlock`) 과 페이지네이션(`Pagination`) 은 각 페이지가
 * 개별적으로 조립하며, 이 컴포넌트는 순수 테이블 표시만 담당한다.
 *
 * 고정 높이(`TABLE_ROW_H_*`, `TABLE_THEAD_H`)는 `useFixedPageSize` 의
 * overhead / rowHeight 계산과 동일한 값을 써야 한다.
 */
export function BaseTable<T>({
  items,
  columns,
  onRowClick,
  rowKey,
  compact = false,
}: BaseTableProps<T>) {
  const { theme } = useThemeStore();
  const cellPadX = compact ? "20px" : "8px";
  const rowH = compact ? TABLE_ROW_H_COMPACT : TABLE_ROW_H_NORMAL;
  const nowrap = compact ? ("nowrap" as const) : undefined;
  const getKey = rowKey ?? ((item: T) => (item as { idx?: string | number }).idx ?? "");

  const thStyle: CSSProperties = {
    padding: `0 ${cellPadX}`,
    whiteSpace: nowrap,
    height: `${TABLE_THEAD_H}px`,
    boxSizing: "border-box",
  };
  const tdBaseStyle: CSSProperties = {
    padding: `0 ${cellPadX}`,
    whiteSpace: nowrap,
    height: `${rowH}px`,
    boxSizing: "border-box",
  };

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        color: theme.colors.text,
        fontSize: theme.fontSize.base,
        textAlign: "center",
      }}
    >
      <thead>
        <tr
          style={{
            borderBottom: `2px solid ${theme.colors.surfaceMuted}`,
            height: `${TABLE_THEAD_H}px`,
          }}
        >
          {columns.map((col) => (
            <th key={col.key} style={thStyle}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr
            key={getKey(item)}
            onClick={onRowClick ? () => onRowClick(item) : undefined}
            style={{
              borderBottom: `1px solid ${theme.colors.surfaceMuted}`,
              cursor: onRowClick ? "pointer" : "default",
              height: `${rowH}px`,
            }}
            onMouseEnter={(e) => {
              if (onRowClick) {
                e.currentTarget.style.backgroundColor = theme.colors.surfaceMuted;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {columns.map((col) => (
              <td key={col.key} style={{ ...tdBaseStyle, ...col.cellStyle }}>
                {col.render
                  ? col.render(item)
                  : ((item as Record<string, unknown>)[col.key] as ReactNode)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
