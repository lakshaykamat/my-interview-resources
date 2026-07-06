"use client";

import { useMemo } from "react";
import { useQuestionFilter } from "@/components/question-filter-context";
import type { QuestionMeta } from "@/lib/question-filter";

export function useFilterCounts(allMeta: QuestionMeta[]) {
  const { activeDifficulties, activeTopics } = useQuestionFilter();

  const difficultyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const meta of allMeta) {
      if (meta.difficulty === null) continue;
      const matchesTopics =
        activeTopics.size === 0 || meta.topics.some((t) => activeTopics.has(t));
      if (matchesTopics) {
        counts[meta.difficulty] = (counts[meta.difficulty] ?? 0) + 1;
      }
    }
    return counts;
  }, [allMeta, activeTopics]);

  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const meta of allMeta) {
      const matchesDifficulty =
        activeDifficulties.size === 0 ||
        (meta.difficulty !== null && activeDifficulties.has(meta.difficulty));
      if (matchesDifficulty) {
        for (const t of meta.topics) {
          counts[t] = (counts[t] ?? 0) + 1;
        }
      }
    }
    return counts;
  }, [allMeta, activeDifficulties]);

  return { difficultyCounts, topicCounts };
}
