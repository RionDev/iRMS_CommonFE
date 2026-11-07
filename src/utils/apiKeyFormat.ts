/** 키 만료 선택지. days=null 은 무기한. */
export const EXPIRY_OPTIONS: { label: string; days: number | null }[] = [
  { label: "30일", days: 30 },
  { label: "90일", days: 90 },
  { label: "180일", days: 180 },
  { label: "무기한", days: null },
];

/** 역할에 따라 고를 수 있는 만료 옵션. 무기한이 허용되지 않으면(GUEST) 무기한을 뺀다. */
export function expiryOptionsFor(unlimitedAllowed: boolean): typeof EXPIRY_OPTIONS {
  return unlimitedAllowed ? EXPIRY_OPTIONS : EXPIRY_OPTIONS.filter((o) => o.days !== null);
}

const fmt = new Intl.NumberFormat("ko-KR");

/** "1,234 / 5,000". 한도를 넘은 값은 한도로 캡한다 (거절된 호출도 카운트에 남으므로). */
export function formatUsage(used: number, limit: number): string {
  return `${fmt.format(Math.min(used, limit))} / ${fmt.format(limit)}`;
}

/** ISO 문자열의 날짜 부분. null 이면 empty 문구. */
export function formatDate(iso: string | null, empty = "없음"): string {
  return iso ? iso.slice(0, 10) : empty;
}

/** 빌드 시 주입된 API base. 비어 있으면 현재 origin (dev 프록시). */
export function apiBaseUrl(): string {
  const configured = (import.meta.env.VITE_API_BASE_URL || "").trim();
  return configured || window.location.origin;
}

export function curlExample(baseUrl: string, key = "<키>"): string {
  return `curl -H "X-API-Key: ${key}" ${baseUrl}/api/sample/samples`;
}

/** 키 scopes(path 목록)를 앱 이름으로 바꿔 ", " 로 잇는다. 선택지에 없는 path(허용이 꺼진 앱)는 path 그대로. */
export function scopeLabels(
  scopes: string[],
  options: { path: string; name: string }[],
): string {
  if (scopes.length === 0) return "-";
  const byPath = new Map(options.map((o) => [o.path, o.name]));
  return scopes.map((p) => byPath.get(p) ?? p).join(", ");
}
