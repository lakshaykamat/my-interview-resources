"use client";

import { useState, useSyncExternalStore } from "react";
import { SETTINGS_KEYS, type ThemePreference } from "@/lib/settings";

const SunIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="h-3.5 w-3.5">
    <circle cx="8" cy="8" r="2.5" />
    <path d="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M11.5 4.5l-1.1 1.1M4.5 11.5l-1.1 1.1" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
    <path d="M13.5 9.5A6 6 0 0 1 6.5 2.5a.5.5 0 0 0-.6-.6A6.5 6.5 0 1 0 14.1 10a.5.5 0 0 0-.6-.5Z" />
  </svg>
);

const MonitorIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
    <rect x="1" y="2" width="14" height="10" rx="1.5" />
    <path d="M5 14h6M8 12v2" />
  </svg>
);

const THEME_OPTIONS: { value: ThemePreference; label: string; Icon: () => React.ReactElement }[] = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
  { value: "system", label: "System", Icon: MonitorIcon },
];

type RevalidateStatus = "idle" | "loading" | "success" | "error";

function subscribeToClientReady() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

function readStoredTheme(): ThemePreference {
  if (typeof window === "undefined") return "system";

  const storedTheme = window.localStorage.getItem(SETTINGS_KEYS.theme);
  return storedTheme === "light" || storedTheme === "dark"
    ? storedTheme
    : "system";
}

function readStoredZenRandom() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SETTINGS_KEYS.zenRandom) === "true";
}

export default function SettingsPage() {
  const isClientReady = useSyncExternalStore(
    subscribeToClientReady,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [theme, setTheme] = useState<ThemePreference>(readStoredTheme);
  const [zenRandom, setZenRandom] = useState(readStoredZenRandom);
  const [revalidateStatus, setRevalidateStatus] = useState<RevalidateStatus>("idle");

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

  async function handleRevalidate() {
    setRevalidateStatus("loading");
    try {
      const res = await fetch("/api/revalidate", { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      setRevalidateStatus("success");
      setTimeout(() => setRevalidateStatus("idle"), 3000);
    } catch {
      setRevalidateStatus("error");
      setTimeout(() => setRevalidateStatus("idle"), 3000);
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

  if (!isClientReady) {
    return (
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-2xl px-5 py-12" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl px-5 py-10 sm:py-16">

        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Settings
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your preferences and reading experience.
          </p>
        </div>

        <div className="space-y-6">

          {/* Appearance section */}
          <section>
            <SectionLabel>Appearance</SectionLabel>
            <SettingsCard>
              <SettingsRow
                label="Theme"
                description="Choose between light, dark, or your system preference."
              >
                <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-700 dark:bg-zinc-800">
                  {THEME_OPTIONS.map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleThemeChange(value)}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                        theme === value
                          ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
                          : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                      }`}
                    >
                      <Icon />
                      {label}
                    </button>
                  ))}
                </div>
              </SettingsRow>
            </SettingsCard>
          </section>

          {/* Zen Mode section */}
          <section>
            <SectionLabel>Zen Mode</SectionLabel>
            <SettingsCard>
              <label className="flex cursor-pointer items-center justify-between gap-6 select-none">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Random order
                  </p>
                  <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                    Shuffle questions each time you enter Zen mode.
                  </p>
                </div>
                <div className="relative shrink-0">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={zenRandom}
                    onChange={(e) => handleZenRandomChange(e.target.checked)}
                  />
                  <div
                    className={`flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      zenRandom
                        ? "bg-zinc-900 dark:bg-zinc-100"
                        : "bg-zinc-200 dark:bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`ml-0.5 block h-5 w-5 rounded-full shadow-sm transition-transform duration-200 ${
                        zenRandom
                          ? "translate-x-5 bg-white dark:bg-zinc-900"
                          : "translate-x-0 bg-white dark:bg-zinc-400"
                      }`}
                    />
                  </div>
                </div>
              </label>
            </SettingsCard>
          </section>

          {/* Data & Cache section */}
          <section>
            <SectionLabel>Data &amp; Cache</SectionLabel>
            <SettingsCard>
              <SettingsRow
                label="Refresh content"
                description="Force a reload of all Notion pages from the source. Content is normally refreshed every 6 hours."
              >
                <button
                  type="button"
                  onClick={handleRevalidate}
                  disabled={revalidateStatus === "loading"}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all duration-150 disabled:cursor-not-allowed ${
                    revalidateStatus === "success"
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-800"
                      : revalidateStatus === "error"
                        ? "bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950/40 dark:text-red-400 dark:ring-red-800"
                        : "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                  }`}
                >
                  {revalidateStatus === "loading" && (
                    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 2a6 6 0 1 0 6 6" strokeLinecap="round" />
                    </svg>
                  )}
                  {revalidateStatus === "success" && (
                    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8l3.5 3.5L13 4.5" />
                    </svg>
                  )}
                  {revalidateStatus === "error" && (
                    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M8 5v4M8 11v1" />
                      <circle cx="8" cy="8" r="6.5" />
                    </svg>
                  )}
                  {revalidateStatus === "idle" && (
                    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13.5 2.5v4h-4" />
                      <path d="M13.36 9A6 6 0 1 1 12 4.64" />
                    </svg>
                  )}
                  {revalidateStatus === "idle" && "Refresh now"}
                  {revalidateStatus === "loading" && "Refreshing…"}
                  {revalidateStatus === "success" && "Refreshed"}
                  {revalidateStatus === "error" && "Failed — retry"}
                </button>
              </SettingsRow>
            </SettingsCard>
          </section>

        </div>
      </div>
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
      {children}
    </p>
  );
}

function SettingsCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function SettingsRow({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</p>
        <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
