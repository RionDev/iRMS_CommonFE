import { useThemeStore } from "../stores/themeStore";

interface AvatarProps {
  name: string;
  size?: number;
  title?: string;
  style?: React.CSSProperties;
}

const AVATAR_PALETTE = {
  light: [
    "#E53935", // red
    "#D81B60", // pink
    "#8E24AA", // purple
    "#3949AB", // indigo
    "#1976D2", // blue
    "#00897B", // teal
    "#43A047", // green
    "#F57C00", // orange
    "#6D4C41", // brown
    "#546E7A", // blue-grey
  ],
  dark: [
    "#EF5350",
    "#EC407A",
    "#AB47BC",
    "#5C6BC0",
    "#42A5F5",
    "#26A69A",
    "#66BB6A",
    "#FFA726",
    "#8D6E63",
    "#78909C",
  ],
};

const EMPTY_BG = { light: "#9E9E9E", dark: "#616161" };

function getInitials(name: string): string {
  if (!name?.trim()) return "?";
  const trimmed = name.trim();

  // 한글 포함: 앞 2글자 (1글자 이름은 그대로)
  if (/[\u3131-\uD79D]/.test(trimmed)) {
    return trimmed.slice(0, 2);
  }

  // 영문: 공백 분리 단어의 첫글자 최대 2개
  const words = trimmed.split(/\s+/);
  if (words.length >= 2 && words[0] && words[1]) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function Avatar({ name, size = 32, title, style }: AvatarProps) {
  const { isDarkMode } = useThemeStore();
  const initials = getInitials(name);
  const isEmpty = !name?.trim();

  const palette = isDarkMode ? AVATAR_PALETTE.dark : AVATAR_PALETTE.light;
  const bg = isEmpty
    ? isDarkMode
      ? EMPTY_BG.dark
      : EMPTY_BG.light
    : palette[hashCode(name) % palette.length];

  return (
    <div
      title={title ?? (isEmpty ? undefined : name)}
      aria-label={isEmpty ? "사용자" : name}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color: "#ffffff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        fontWeight: 600,
        lineHeight: 1,
        userSelect: "none",
        flexShrink: 0,
        ...style,
      }}
    >
      {initials}
    </div>
  );
}
