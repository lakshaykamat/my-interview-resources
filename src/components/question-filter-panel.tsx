"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterChip } from "@/components/filter-chip";
import { useQuestionFilter } from "@/components/question-filter-context";
import { useFilterCounts } from "@/hooks/use-filter-counts";
import { useModalEscapeAndBodyLock } from "@/hooks/use-modal-escape-and-body-lock";
import { useNavbarPortalSlot } from "@/hooks/use-navbar-portal-slot";
import type { QuestionMeta } from "@/lib/question-filter";

type FilterSectionProps = {
  label: string;
  items: string[];
  counts: Record<string, number>;
  isActive: (item: string) => boolean;
  onToggle: (item: string) => void;
};

function FilterSection({ label, items, counts, isActive, onToggle }: FilterSectionProps) {
  const visibleItems = items.filter((item) => isActive(item) || (counts[item] ?? 0) > 0);
  if (visibleItems.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {visibleItems.map((item) => (
          <FilterChip
            key={item}
            label={item}
            count={counts[item] ?? 0}
            isActive={isActive(item)}
            onClick={() => onToggle(item)}
          />
        ))}
      </div>
    </div>
  );
}

type FilterContentProps = {
  difficulties: string[];
  topics: string[];
  allMeta: QuestionMeta[];
  onClose?: () => void;
};

function FilterContent({ difficulties, topics, allMeta, onClose }: FilterContentProps) {
  const { activeDifficulties, activeTopics, toggleDifficulty, toggleTopic, clearAll, hasActiveFilters } =
    useQuestionFilter();
  const { difficultyCounts, topicCounts } = useFilterCounts(allMeta);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
          Filter
        </h2>
        <div className="flex items-center gap-1">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="rounded px-2 py-0.5 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-6 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              aria-label="Close filter panel"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <FilterSection
        label="Difficulty"
        items={difficulties}
        counts={difficultyCounts}
        isActive={(d) => activeDifficulties.has(d)}
        onToggle={toggleDifficulty}
      />

      <FilterSection
        label="Topics"
        items={topics}
        counts={topicCounts}
        isActive={(t) => activeTopics.has(t)}
        onToggle={toggleTopic}
      />
    </div>
  );
}

type QuestionFilterPanelProps = {
  difficulties: string[];
  topics: string[];
  allMeta: QuestionMeta[];
};

export function QuestionFilterPanel({ difficulties, topics, allMeta }: QuestionFilterPanelProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const navbarSlot = useNavbarPortalSlot("question-filter-navbar-slot");
  const { hasActiveFilters } = useQuestionFilter();

  useModalEscapeAndBodyLock(isMobileOpen, () => setIsMobileOpen(false));

  if (difficulties.length === 0 && topics.length === 0) return null;

  return (
    <>
      {navbarSlot &&
        createPortal(
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600",
              hasActiveFilters
                ? "border-zinc-900 bg-zinc-900 text-zinc-50 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-50",
            )}
            aria-label="Open question filters"
            aria-expanded={isMobileOpen}
          >
            <Filter className="size-4" aria-hidden="true" />
          </button>,
          navbarSlot,
        )}

      {isMobileOpen && (
        <div className="fixed inset-0 z-[60] bg-zinc-950/45 dark:bg-black/60 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close filters"
          />
          <nav
            aria-label="Question filters"
            className="absolute right-0 flex h-dvh w-[min(22rem,calc(100vw-2rem))] flex-col border-l border-zinc-200 bg-white shadow-2xl shadow-zinc-950/10 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/30"
          >
            <div className="flex h-14 items-center justify-between gap-3 border-b border-zinc-200 px-4 dark:border-zinc-800">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                Filters
              </span>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                aria-label="Close filters"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <FilterContent
                difficulties={difficulties}
                topics={topics}
                allMeta={allMeta}
                onClose={() => setIsMobileOpen(false)}
              />
            </div>
          </nav>
        </div>
      )}

      {isDesktopOpen && (
        <aside className="hidden min-w-0 lg:sticky lg:top-14 lg:-mr-6 lg:-mt-12 lg:col-start-3 lg:block lg:h-[calc(100dvh-3.5rem)] lg:w-full lg:max-w-72 lg:justify-self-end">
          <div className="flex h-full flex-col border border-zinc-200 bg-white/80 shadow-sm shadow-zinc-200/50 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70 dark:shadow-none">
            <div className="flex-1 overflow-y-auto p-4">
              <FilterContent
                difficulties={difficulties}
                topics={topics}
                allMeta={allMeta}
                onClose={() => setIsDesktopOpen(false)}
              />
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
