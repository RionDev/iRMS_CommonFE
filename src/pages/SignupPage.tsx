import { useState } from "react";
import { Modal } from "../components/Modal";
import { SignupForm } from "../components/SignupForm";
import { signup } from "../services/signupService";
import { useThemeStore } from "../stores/themeStore";
import type { RoleType, TeamType } from "../types/constants";

interface SignupPageProps {
  loginUrl?: string;
}

export function SignupPage({ loginUrl = "/login" }: SignupPageProps) {
  const { theme } = useThemeStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (data: {
    id: string;
    name: string;
    password: string;
    password_confirm: string;
    role: RoleType;
    team: TeamType | null;
  }) => {
    if (data.password !== data.password_confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const normalizedId = data.id
        .trim()
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .replace(/\s+/g, "");
      await signup({ ...data, id: normalizedId });
      setSuccessMessage(
        "회원가입이 완료되었습니다. 관리자 승인 후 로그인할 수 있습니다.",
      );
    } catch {
      // interceptor가 alert 처리
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.pageBackground,
        color: theme.colors.text,
        fontFamily: theme.fontFamily,
      }}
    >
      <div
        style={{
          backgroundColor: theme.colors.surface,
          padding: "32px",
          borderRadius: theme.radius.md,
          boxShadow: theme.shadow.card,
          width: "100%",
          maxWidth: "360px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "24px",
            fontSize: theme.fontSize.xxl,
          }}
        >
          iRMS 회원가입
        </h1>
        <SignupForm onSubmit={handleSubmit} loading={loading} error={error} />
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <span style={{ fontSize: theme.fontSize.base, color: theme.colors.textMuted }}>
            이미 계정이 있으신가요?{" "}
            <a
              href={loginUrl}
              style={{
                color: theme.colors.primary,
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              로그인
            </a>
          </span>
        </div>
      </div>
      <Modal
        isOpen={successMessage !== null}
        onClose={() => {
          setSuccessMessage(null);
          window.location.href = loginUrl;
        }}
        title="가입 완료"
      >
        <p style={{ margin: 0, color: theme.colors.text }}>{successMessage}</p>
      </Modal>
    </div>
  );
}
