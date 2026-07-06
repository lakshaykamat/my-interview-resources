"use client";

import { useMemo } from "react";
import { useQuestionFilter } from "@/components/question-filter-context";
import { parseQuestionMeta } from "@/lib/question-filter";
import { groupBlocksByHeading } from "@/lib/zen-mode";
import type { NotionContentBlock } from "@/types/notion";

export function useFilteredBlocks(blocks: NotionContentBlock[]): NotionContentBlock[] {
  const { activeDifficulties, activeTopics, hasActiveFilters } = useQuestionFilter();

  return useMemo(() => {
    if (!hasActiveFilters) return blocks;

    const allGroups = groupBlocksByHeading(blocks);
    if (allGroups.length === 0) return blocks;

    const firstGroupIdx = blocks.indexOf(allGroups[0].question);
    const introBlocks = firstGroupIdx > 0 ? blocks.slice(0, firstGroupIdx) : [];
    const result: NotionContentBlock[] = [...introBlocks];

    let pendingSectionHeading: NotionContentBlock | null = null;

    for (const group of allGroups) {
      const meta = parseQuestionMeta(group);
      const hasFilterableMeta = meta.difficulty !== null || meta.topics.length > 0;

      if (!hasFilterableMeta) {
        pendingSectionHeading = group.question;
        continue;
      }

      const matchesDifficulty =
        activeDifficulties.size === 0 ||
        (meta.difficulty !== null && activeDifficulties.has(meta.difficulty));
      const matchesTopics =
        activeTopics.size === 0 || meta.topics.some((t) => activeTopics.has(t));

      if (matchesDifficulty && matchesTopics) {
        if (pendingSectionHeading) {
          result.push(pendingSectionHeading);
          pendingSectionHeading = null;
        }
        result.push(group.question, ...group.answerBlocks);
      }
    }

    return result;
  }, [blocks, activeDifficulties, activeTopics, hasActiveFilters]);
}
