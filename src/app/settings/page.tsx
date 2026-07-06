"use client";

import { useEffect, useState } from "react";
import { SETTINGS_KEYS, type ThemePreference } from "@/lib/settings";

export default function SettingsPage() {
  const [theme, setTheme] = useState<ThemePreference>("system");
  const [zenRandom, setZenRandom] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(SETTINGS_KEYS.theme);
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    } else {
      setTheme("system");
    }
    setZenRandom(window.localStorage.getItem(SETTINGS_KEYS.zenRandom) === "true");
    setMounted(true);
  }, []);

  function handleThemeChange(value: ThemePreference) {
    setTheme(value);
    if (value === "system") {
      window.localStorage.removeItem(SETTINGS_KEYS.theme);
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", prefersDark);
    } else {
      window.localStorage.setItem(SETTINGS_KEYS.theme, value);
      document.documentElement.classList.toggle("dark", value === "dark");
    }
  }

  function handleZenRandomChange(value: boolean) {
    setZenRandom(value);
    if (value) {
      window.localStorage.setItem(SETTINGS_KEYS.zenRandom, "true");
    } else {
      window.localStorage.removeItem(SETTINGS_KEYS.zenRandom);
    }
  }

  if (!mounted) {
    return (
      <main className="min-h-screen bg-zinc-50 px-5 py-12 dark:bg-zinc-950">
        <div className="mx-auto max-w-2xl" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-5 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10 border-b border-zinc-200 pb-8 dark:border-zinc-800">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Settings
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your preferences
          </p>
        </header>

        <div className="space-y-8">
          {/* Theme */}
          <section>
            <h2 className="mb-1 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Theme
            </h2>
            <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
              Choose how the app looks. System follows your OS preference.
            </p>
            <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
              {(["system", "light", "dark"] as ThemePreference[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleThemeChange(option)}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                    theme === option
                      ? "bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950"
                      : "text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </section>

          <div className="border-b border-zinc-200 dark:border-zinc-800" />

          {/* Zen Mode */}
          <section>
            <h2 className="mb-1 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Zen Mode
            </h2>
            <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
              Configure how questions are presented in Zen mode.
            </p>
            <label className="flex cursor-pointer items-start gap-4 rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/60">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                  Random order
                </p>
                <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                  Shuffle questions into a random order each time you enter Zen mode.
                </p>
              </div>
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={zenRandom}
                  onChange={(e) => handleZenRandomChange(e.target.checked)}
                />
                <div
                  onClick={() => handleZenRandomChange(!zenRandom)}
                  className={`flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${
                    zenRandom
                      ? "bg-zinc-950 dark:bg-zinc-50"
                      : "bg-zinc-200 dark:bg-zinc-700"
                  }`}
                >
                  <span
                    className={`ml-0.5 block h-5 w-5 rounded-full bg-white shadow-sm transition-transform dark:bg-zinc-950 ${
                      zenRandom ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
            </label>
          </section>
        </div>
      </div>
    </main>
  );
}
