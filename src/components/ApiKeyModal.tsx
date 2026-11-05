import { type CSSProperties, type FormEvent, useCallback, useEffect, useState } from "react";
import { createApiKey, listApiKeys, revokeApiKey } from "../services/apiKeyService";
import { useThemeStore } from "../stores/themeStore";
import type { ApiKeyItem, ApiKeyLimits, CreateApiKeyResponse, ScopeOption } from "../types/apiKey";
import {
  EXPIRY_OPTIONS,
  apiBaseUrl,
  curlExample,
  formatDate,
  formatUsage,
  scopeLabels,
} from "../utils/apiKeyFormat";
import { Button } from "./Button";
import { Input } from "./Input";
import { Modal } from "./Modal";

/**
 * 내 API 키 관리 모달 — 목록·생성·무효화.
 * 키 전문은 생성 직후 한 번만 보여주고, 모달을 닫거나 "확인했습니다" 를 누르면 다시 볼 수 없다.
 * 한도·최대 개수는 BE 응답(limits)으로 표시하고 하드코딩하지 않는다.
 */
export function ApiKeyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { theme } = useThemeStore();
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [limits, setLimits] = useState<ApiKeyLimits | null>(null);
  const [options, setOptions] = useState<ScopeOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreateApiKeyResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // 생성 폼
  const [name, setName] = useState("");
  const [expiryIdx, setExpiryIdx] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  // 무효화 2단계 확인 (브라우저 confirm 을 쓰지 않는다)
  const [confirmIdx, setConfirmIdx] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listApiKeys();
      setKeys(res.api_keys);
      setLimits(res.limits);
      setOptions(res.available_scopes);
      // 선택지가 하나뿐이면 미리 체크해 둔다
      setSelected((prev) => {
        const valid = prev.filter((p) => res.available_scopes.some((o) => o.path === p));
        return valid.length > 0 || res.available_scopes.length !== 1 ? valid : [res.available_scopes[0].path];
      });
    } catch {
      setError("키 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCreated(null);
      setCopied(false);
      setConfirmIdx(null);
      void load();
    }
  }, [isOpen, load]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setCreating(true);
    try {
      const res = await createApiKey({
        name: name.trim(),
        expires_in_days: EXPIRY_OPTIONS[expiryIdx].days,
        scopes: selected,
      });
      setCreated(res);
      setCopied(false);
      setName("");
      await load();
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } }).response?.status;
      setError(
        status === 409
          ? `활성 키는 최대 ${limits?.max_active ?? 5}개입니다. 쓰지 않는 키를 먼저 무효화하세요.`
          : status === 400
            ? "고른 앱 중 지금은 키로 열 수 없는 앱이 있습니다. 목록을 다시 확인하세요."
            : "키를 만들지 못했습니다.",
      );
      await load();
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (idx: number) => {
    if (confirmIdx !== idx) {
      setConfirmIdx(idx);
      return;
    }
    setError(null);
    try {
      await revokeApiKey(idx);
      setConfirmIdx(null);
      await load();
    } catch {
      setError("키를 무효화하지 못했습니다.");
    }
  };

  const handleCopy = async () => {
    if (!created) return;
    try {
      await navigator.clipboard.writeText(created.key);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  // 전문을 보여주는 동안은 배경 클릭으로 닫히지 않는다 — 다시 볼 수 없는 키가 실수로 사라지지 않게.
  // "확인했습니다" 로 패널을 지운 뒤에만 닫힌다. 닫을 때 전문은 state 에서도 지운다.
  const handleClose = () => {
    if (created) return;
    setCreated(null);
    setCopied(false);
    onClose();
  };

  const atMax = limits !== null && keys.length >= limits.max_active;
  const muted: CSSProperties = { color: theme.colors.textMuted, fontSize: theme.fontSize.sm };
  const cell: CSSProperties = {
    padding: "6px 8px",
    borderBottom: `1px solid ${theme.colors.border}`,
    fontSize: theme.fontSize.sm,
    whiteSpace: "nowrap",
  };
  const mono: CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="API 키 관리" maxWidth={760}>
      {limits && (
        <p style={{ ...muted, margin: "0 0 12px" }}>
          키 1개당 분당 {limits.per_minute.toLocaleString("ko-KR")}회 · 일{" "}
          {limits.per_day.toLocaleString("ko-KR")}회
        </p>
      )}

      {created && (
        <div
          style={{
            background: theme.colors.surfaceMuted,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.sm,
            padding: "12px",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "6px", color: theme.colors.text }}>
            새 키 "{created.name}" 가 만들어졌습니다
          </div>
          <div style={{ color: theme.colors.danger, fontSize: theme.fontSize.sm, marginBottom: "8px" }}>
            이 창을 닫으면 키 전문을 다시 볼 수 없습니다. 지금 복사해 두세요.
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <code
              style={{
                ...mono,
                flex: 1,
                padding: "8px",
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radius.sm,
                overflowX: "auto",
                color: theme.colors.text,
              }}
            >
              {created.key}
            </code>
            <Button type="button" onClick={() => void handleCopy()}>
              {copied ? "복사됨" : "복사"}
            </Button>
          </div>
          <pre style={{ ...mono, ...muted, margin: "8px 0 0", whiteSpace: "pre-wrap" }}>
            {curlExample(apiBaseUrl(), created.key)}
          </pre>
          <Button
            type="button"
            variant="secondary"
            style={{ marginTop: "8px" }}
            onClick={() => setCreated(null)}
          >
            확인했습니다
          </Button>
        </div>
      )}

      <div style={{ overflowX: "auto", marginBottom: "16px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", color: theme.colors.text }}>
          <thead>
            <tr>
              {["이름", "키", "앱", "만료", "오늘 사용량", "마지막 사용", ""].map((h, i) => (
                <th key={i} style={{ ...cell, textAlign: "left", color: theme.colors.textMuted }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} style={{ ...cell, ...muted }}>불러오는 중…</td>
              </tr>
            )}
            {!loading && keys.length === 0 && (
              <tr>
                <td colSpan={7} style={{ ...cell, ...muted }}>아직 만든 키가 없습니다.</td>
              </tr>
            )}
            {!loading &&
              keys.map((k) => (
                <tr key={k.idx}>
                  <td style={cell}>{k.name}</td>
                  <td style={{ ...cell, ...mono }}>{k.key_prefix}…</td>
                  <td style={cell}>{scopeLabels(k.scopes, options)}</td>
                  <td style={cell}>{formatDate(k.expires_at, "무기한")}</td>
                  <td style={cell}>{limits ? formatUsage(k.usage_today, limits.per_day) : k.usage_today}</td>
                  <td style={cell}>{formatDate(k.last_used_at)}</td>
                  <td style={{ ...cell, textAlign: "right" }}>
                    <Button
                      type="button"
                      variant={confirmIdx === k.idx ? "primary" : "secondary"}
                      style={{ padding: "4px 10px", fontSize: theme.fontSize.sm }}
                      onClick={() => void handleRevoke(k.idx)}
                      onBlur={() => confirmIdx === k.idx && setConfirmIdx(null)}
                    >
                      {confirmIdx === k.idx ? "정말 무효화" : "무효화"}
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleCreate} style={{ display: "flex", gap: "8px", alignItems: "flex-end", flexWrap: "wrap" }}>
        <div style={{ flexBasis: "100%", marginBottom: "4px" }}>
          <span style={{ display: "block", marginBottom: "4px", fontSize: theme.fontSize.base, color: theme.colors.text }}>
            키로 쓸 앱
          </span>
          {options.length === 0 ? (
            <span style={muted}>지금 키로 열 수 있는 앱이 없습니다. 관리자에게 문의하세요.</span>
          ) : (
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {options.map((o) => (
                <label key={o.path} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: theme.fontSize.base, color: theme.colors.text }}>
                  <input
                    type="checkbox"
                    checked={selected.includes(o.path)}
                    disabled={atMax}
                    onChange={(e) =>
                      setSelected((prev) =>
                        e.target.checked ? [...prev, o.path] : prev.filter((p) => p !== o.path),
                      )
                    }
                  />
                  {o.name}
                  <span style={{ ...muted, ...mono }}>{o.path}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <Input
            label="새 키 이름"
            value={name}
            maxLength={100}
            placeholder="예: 샘플 수집 스크립트"
            onChange={(e) => setName(e.target.value)}
            disabled={atMax}
            required
          />
        </div>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontSize: theme.fontSize.base, color: theme.colors.text }}>
            만료
          </label>
          <select
            value={expiryIdx}
            onChange={(e) => setExpiryIdx(Number(e.target.value))}
            disabled={atMax}
            style={{
              padding: "8px",
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.sm,
              background: theme.colors.surface,
              color: theme.colors.text,
              fontSize: theme.fontSize.base,
              fontFamily: theme.fontFamily,
            }}
          >
            {EXPIRY_OPTIONS.map((o, i) => (
              <option key={o.label} value={i}>{o.label}</option>
            ))}
          </select>
        </div>
        <Button type="submit" disabled={atMax || creating || !name.trim() || selected.length === 0} style={{ marginBottom: "12px" }}>
          만들기
        </Button>
      </form>
      {atMax && (
        <p style={{ ...muted, margin: "0 0 8px" }}>
          활성 키가 {limits?.max_active}개입니다. 새로 만들려면 쓰지 않는 키를 무효화하세요.
        </p>
      )}
      {error && (
        <p style={{ color: theme.colors.danger, margin: "8px 0 0", fontSize: theme.fontSize.base }}>{error}</p>
      )}
    </Modal>
  );
}
