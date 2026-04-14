import type { FormEvent } from "react";
import { useState } from "react";
import { theme } from "../styles/theme";
import { Button } from "./Button";
import { Input } from "./Input";

interface SignupFormProps {
  onSubmit: (data: {
    id: string;
    name: string;
    password: string;
    password_confirm: string;
    role: number;
    team: number | null;
  }) => void;
  loading?: boolean;
  error?: string | null;
}

export function SignupForm({
  onSubmit,
  loading = false,
  error,
}: SignupFormProps) {
  const [id, setId] = useState("");
  const [idError, setIdError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState<number>(3);
  const [team, setTeam] = useState<number | null>(1);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const normalizedId = id.trim();

    if (!isValidEmail(normalizedId)) {
      setIdError("이메일 주소 형식이 올바르지 않습니다.");
      return;
    }

    setIdError(null);
    onSubmit({
      id: normalizedId,
      name,
      password,
      password_confirm: passwordConfirm,
      role,
      team: role === 4 ? null : team,
    });
  };

  const handleRoleChange = (value: number) => {
    setRole(value);
    if (value === 4) {
      setTeam(null);
    } else if (team === null) {
      setTeam(1);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="아이디 (이메일)"
        type="email"
        value={id}
        onChange={(e) => {
          setId(e.target.value);
          if (idError) setIdError(null);
        }}
        placeholder="이메일을 입력하세요"
        autoComplete="username"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        required
      />
      <Input
        label="이름"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름을 입력하세요"
        autoComplete="name"
        required
      />
      <div style={{ marginBottom: "12px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "4px",
            fontSize: "14px",
            color: theme.colors.text,
          }}
        >
          역할
        </label>
        <select
          value={role}
          onChange={(e) => handleRoleChange(Number(e.target.value))}
          style={{
            width: "100%",
            padding: "8px",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.sm,
            fontSize: "14px",
            fontFamily: theme.fontFamily,
            boxSizing: "border-box",
            backgroundColor: theme.colors.surface,
          }}
        >
          <option value={3}>Member</option>
          <option value={2}>Lead</option>
          <option value={4}>Guest</option>
        </select>
      </div>
      <Input
        label="비밀번호"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호를 입력하세요"
        autoComplete="new-password"
        required
      />
      <Input
        label="비밀번호 확인"
        type="password"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        placeholder="비밀번호를 다시 입력하세요"
        autoComplete="new-password"
        required
      />
      <div style={{ marginBottom: "12px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "4px",
            fontSize: "14px",
            color: theme.colors.text,
          }}
        >
          소속 팀
        </label>
        <select
          value={team ?? ""}
          onChange={(e) => setTeam(Number(e.target.value))}
          disabled={role === 4}
          style={{
            width: "100%",
            padding: "8px",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.sm,
            fontSize: "14px",
            fontFamily: theme.fontFamily,
            boxSizing: "border-box",
            backgroundColor: theme.colors.surface,
            opacity: role === 4 ? 0.6 : 1,
          }}
        >
          {role === 4 && <option value="">선택 안 함</option>}
          <option value={1}>Engine</option>
          <option value={2}>Analyst</option>
        </select>
      </div>
      {(idError ?? error) && (
        <p
          style={{
            color: theme.colors.danger,
            fontSize: "14px",
            margin: "0 0 12px 0",
          }}
        >
          {idError ?? error}
        </p>
      )}
      <Button type="submit" disabled={loading} style={{ width: "100%" }}>
        {loading ? "가입 중..." : "회원가입"}
      </Button>
    </form>
  );
}
