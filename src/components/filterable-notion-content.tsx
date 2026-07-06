"use client";

import type { ReactNode } from "react";
import { NotionContent } from "@/components/notion-content";
import { FilterChip } from "@/components/filter-chip";
import { useQuestionFilter } from "@/components/question-filter-context";
import { useFilteredBlocks } from "@/hooks/use-filtered-blocks";
import type { NotionContentBlock, NotionTextBlock } from "@/types/notion";

type Props = {
  blocks: NotionContentBlock[];
};

function MetaDifficultyRow({ value }: { value: string }) {
  const { activeDifficulties, toggleDifficulty } = useQuestionFilter();
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Difficulty</span>
      <FilterChip
        label={value}
        isActive={activeDifficulties.has(value)}
        onClick={() => toggleDifficulty(value)}
      />
    </div>
  );
}

function MetaTopicsRow({ topics }: { topics: string[] }) {
  const { activeTopics, toggleTopic } = useQuestionFilter();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Topics</span>
      {topics.map((t) => (
        <FilterChip
          key={t}
          label={t}
          isActive={activeTopics.has(t)}
          onClick={() => toggleTopic(t)}
        />
      ))}
    </div>
  );
}

const DIFFICULTY_RE = /^Difficulty:\s*(.+)$/i;
const TOPICS_RE = /^Topics:\s*(.+)$/i;

function renderMetaParagraph(block: NotionTextBlock): ReactNode | null {
  const text = block.text.map((t) => t.plainText).join("").trim();

  const diffMatch = text.match(DIFFICULTY_RE);
  if (diffMatch) {
    return <MetaDifficultyRow value={diffMatch[1].trim()} />;
  }

  const topicsMatch = text.match(TOPICS_RE);
  if (topicsMatch) {
    const topics = topicsMatch[1].split(",").map((t) => t.trim()).filter(Boolean);
    return <MetaTopicsRow topics={topics} />;
  }

  return null;
}

export function FilterableNotionContent({ blocks }: Props) {
  const { hasActiveFilters } = useQuestionFilter();
  const filteredBlocks = useFilteredBlocks(blocks);

  const allQuestionsFiltered =
    hasActiveFilters &&
    !filteredBlocks.some(
      (b) => b.type === "heading_1" || b.type === "heading_2" || b.type === "heading_3",
    );

  return (
    <>
      <NotionContent blocks={filteredBlocks} renderParagraph={renderMetaParagraph} />
      {allQuestionsFiltered && (
        <div className="mt-8 rounded-md border border-dashed border-zinc-200 px-4 py-10 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          No questions match your current filters.
        </div>
      )}
    </>
  );
}
