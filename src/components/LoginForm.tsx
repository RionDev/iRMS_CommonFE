import type { FormEvent } from "react";
import { useState } from "react";
import { useThemeStore } from "../stores/themeStore";
import { Button } from "./Button";
import { Input } from "./Input";

interface LoginFormProps {
  onSubmit: (id: string, password: string) => void;
  loading?: boolean;
  error?: string | null;
}

export function LoginForm({
  onSubmit,
  loading = false,
  error,
}: LoginFormProps) {
  const { theme } = useThemeStore();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(id, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="아이디"
        type="text"
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
        label="비밀번호"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호를 입력하세요"
        autoComplete="current-password"
        required
      />
      {error && (
        <p
          style={{
            color: theme.colors.danger,
            fontSize: theme.fontSize.base,
            margin: "0 0 12px 0",
          }}
        >
          {error}
        </p>
      )}
      <Button type="submit" disabled={loading} style={{ width: "100%" }}>
        {loading ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}
