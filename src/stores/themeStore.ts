import { create } from "zustand";
import { darkTheme, lightTheme, type Theme } from "../styles/theme";

const STORAGE_KEY = "IRMS_THEME_MODE";

function getInitialDarkMode(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

interface ThemeState {
  isDarkMode: boolean;
  theme: Theme;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

const initialDark = getInitialDarkMode();

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: initialDark,
  theme: initialDark ? darkTheme : lightTheme,

  toggleDarkMode: () =>
    set((state) => {
      const next = !state.isDarkMode;
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
      return { isDarkMode: next, theme: next ? darkTheme : lightTheme };
    }),

  setDarkMode: (isDark: boolean) => {
    localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    set({ isDarkMode: isDark, theme: isDark ? darkTheme : lightTheme });
  },
}));
