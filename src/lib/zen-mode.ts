import type {
  NotionContentBlock,
  NotionRichText,
  NotionTextBlock,
} from "@/types/notion";

export type ZenQuestionGroup = {
  question: NotionTextBlock;
  answerBlocks: NotionContentBlock[];
};

export function groupBlocksByHeading(
  blocks: NotionContentBlock[],
): ZenQuestionGroup[] {
  const groups: ZenQuestionGroup[] = [];
  let currentGroup: ZenQuestionGroup | null = null;

  for (const block of blocks) {
    if (isHeadingBlock(block)) {
      currentGroup = {
        question: block,
        answerBlocks: [],
      };
      groups.push(currentGroup);
      continue;
    }

    if (currentGroup) {
      currentGroup.answerBlocks.push(block);
    }
  }

  return groups;
}

export function isHeadingBlock(
  block: NotionContentBlock,
): block is NotionTextBlock {
  return (
    block.type === "heading_1" ||
    block.type === "heading_2" ||
    block.type === "heading_3"
  );
}

export function plainRichText(text: NotionRichText[]): string {
  return text.map((item) => item.plainText).join("");
}
