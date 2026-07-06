"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type FilterState = {
  activeDifficulties: Set<string>;
  activeTopics: Set<string>;
  toggleDifficulty: (d: string) => void;
  toggleTopic: (t: string) => void;
  clearAll: () => void;
  hasActiveFilters: boolean;
};

const QuestionFilterContext = createContext<FilterState | null>(null);
const emptyFilterSet = new Set<string>();

function subscribeToClientReady() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

function readFilterParam(name: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  return new Set(new URLSearchParams(window.location.search).getAll(name));
}

function buildFilterUrl(difficulties: Set<string>, topics: Set<string>): string {
  const params = new URLSearchParams();
  for (const d of difficulties) params.append("difficulty", d);
  for (const t of topics) params.append("topic", t);
  const q = params.toString();
  return q ? `${window.location.pathname}?${q}` : window.location.pathname;
}

export function QuestionFilterProvider({ children }: { children: ReactNode }) {
  const isClientReady = useSyncExternalStore(
    subscribeToClientReady,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [activeDifficulties, setActiveDifficulties] = useState<Set<string>>(() =>
    readFilterParam("difficulty"),
  );
  const [activeTopics, setActiveTopics] = useState<Set<string>>(() =>
    readFilterParam("topic"),
  );

  useEffect(() => {
    if (!isClientReady) return;
    window.history.replaceState(null, "", buildFilterUrl(activeDifficulties, activeTopics));
  }, [activeDifficulties, activeTopics, isClientReady]);

  function toggleDifficulty(d: string) {
    setActiveDifficulties((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });
  }

  function toggleTopic(t: string) {
    setActiveTopics((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  }

  function clearAll() {
    setActiveDifficulties(new Set());
    setActiveTopics(new Set());
  }

  const visibleDifficulties = isClientReady ? activeDifficulties : emptyFilterSet;
  const visibleTopics = isClientReady ? activeTopics : emptyFilterSet;

  return (
    <QuestionFilterContext.Provider
      value={{
        activeDifficulties: visibleDifficulties,
        activeTopics: visibleTopics,
        toggleDifficulty,
        toggleTopic,
        clearAll,
        hasActiveFilters: visibleDifficulties.size > 0 || visibleTopics.size > 0,
      }}
    >
      {children}
    </QuestionFilterContext.Provider>
  );
}

export function useQuestionFilter(): FilterState {
  const ctx = useContext(QuestionFilterContext);
  if (!ctx) throw new Error("useQuestionFilter must be used within QuestionFilterProvider");
  return ctx;
}
