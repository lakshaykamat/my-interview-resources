export const SETTINGS_KEYS = {
  theme: "notes-page-theme",
  zenRandom: "notes-page-zen-random",
} as const;

export type ThemePreference = "light" | "dark" | "system";
