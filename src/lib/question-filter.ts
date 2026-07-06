import type { NotionTextBlock } from "@/types/notion";
import type { ZenQuestionGroup } from "@/lib/zen-mode";

export type QuestionMeta = {
  questionId: string;
  difficulty: string | null;
  topics: string[];
};

export function parseQuestionMeta(group: ZenQuestionGroup): QuestionMeta {
  let difficulty: string | null = null;
  const topics: string[] = [];

  for (const block of group.answerBlocks) {
    if (block.type !== "paragraph") continue;
    const text = (block as NotionTextBlock).text.map((t) => t.plainText).join("").trim();
    if (!text) continue;

    const diffMatch = text.match(/^Difficulty:\s*(.+)$/i);
    if (diffMatch) {
      difficulty = diffMatch[1].trim();
      continue;
    }

    const topicsMatch = text.match(/^Topics:\s*(.+)$/i);
    if (topicsMatch) {
      topics.push(...topicsMatch[1].split(",").map((t) => t.trim()).filter(Boolean));
      continue;
    }

    break;
  }

  return { questionId: group.question.id, difficulty, topics };
}

export function collectAllMeta(groups: ZenQuestionGroup[]): {
  difficulties: string[];
  topics: string[];
  difficultyCounts: Record<string, number>;
  topicCounts: Record<string, number>;
} {
  const diffCounts: Record<string, number> = {};
  const topicCounts: Record<string, number> = {};

  for (const group of groups) {
    const meta = parseQuestionMeta(group);
    if (meta.difficulty) {
      diffCounts[meta.difficulty] = (diffCounts[meta.difficulty] ?? 0) + 1;
    }
    for (const t of meta.topics) {
      topicCounts[t] = (topicCounts[t] ?? 0) + 1;
    }
  }

  const diffOrder = ["Easy", "Medium", "Hard"];
  const difficulties = Object.keys(diffCounts).sort((a, b) => {
    const ai = diffOrder.indexOf(a);
    const bi = diffOrder.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return {
    difficulties,
    topics: Object.keys(topicCounts).sort(),
    difficultyCounts: diffCounts,
    topicCounts,
  };
}
