import type { FormEvent } from "react";
import { useState } from "react";
import { theme } from "../styles/theme";
import { Role, Team } from "../types/constants";
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
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState<number>(Role.MEMBER);
  const [team, setTeam] = useState<number | null>(Team.ENGINE);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      id,
      name,
      password,
      password_confirm: passwordConfirm,
      role,
      team: role === Role.GUEST ? null : team,
    });
  };

  const handleRoleChange = (value: number) => {
    setRole(value);
    if (value === Role.GUEST) {
      setTeam(null);
    } else if (team === null) {
      setTeam(Team.ENGINE);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="아이디 (이메일)"
        type="email"
        value={id}
        onChange={(e) => setId(e.target.value)}
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
          <option value={Role.MEMBER}>Member</option>
          <option value={Role.LEAD}>Lead</option>
          <option value={Role.GUEST}>Guest</option>
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
          disabled={role === Role.GUEST}
          style={{
            width: "100%",
            padding: "8px",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.sm,
            fontSize: "14px",
            fontFamily: theme.fontFamily,
            boxSizing: "border-box",
            backgroundColor: theme.colors.surface,
            opacity: role === Role.GUEST ? 0.6 : 1,
          }}
        >
          {role === Role.GUEST && <option value="">선택 안 함</option>}
          <option value={Team.ENGINE}>엔진팀</option>
          <option value={Team.ANALYST}>분석팀</option>
        </select>
      </div>
      {error && (
        <p
          style={{
            color: theme.colors.danger,
            fontSize: "14px",
            margin: "0 0 12px 0",
          }}
        >
          {error}
        </p>
      )}
      <Button type="submit" disabled={loading} style={{ width: "100%" }}>
        {loading ? "가입 중..." : "회원가입"}
      </Button>
    </form>
  );
}
