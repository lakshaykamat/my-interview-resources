import "server-only";

import { Client } from "@notionhq/client";
import { unstable_cache } from "next/cache";
import type {
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints/blocks";
import type {
  PageObjectResponse,
  PartialPageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints/common";
import type {
  NotionContentBlock,
  NotionLoadState,
  NotionRichText,
  NotionTableRow,
  NotionTextBlockType,
} from "@/types/notion";

const supportedTextBlockTypes = new Set<NotionTextBlockType>([
  "paragraph",
  "heading_1",
  "heading_2",
  "heading_3",
  "bulleted_list_item",
  "numbered_list_item",
  "toggle",
  "quote",
  "callout",
]);

const notionCacheRevalidateSeconds = 60 * 60 * 6;

export async function loadNotionPageContent(): Promise<NotionLoadState> {
  return loadNotionPage();
}

export async function loadNotionPageById(pageId: string): Promise<NotionLoadState> {
  return loadNotionPage(pageId);
}

export async function loadNotionRootPageIndex(): Promise<NotionLoadState> {
  return loadNotionPage(undefined, { includeChildPageContent: false });
}

async function loadNotionPage(
  pageId?: string,
  options: { includeChildPageContent?: boolean } = {},
): Promise<NotionLoadState> {
  const config = readNotionConfig();

  if (!config.ready) {
    return {
      status: "setup",
      missingVariables: config.missingVariables,
    };
  }

  const targetPageId = pageId ?? config.rootPageId;
  const includeChildPageContent = options.includeChildPageContent !== false;

  try {
    return await loadCachedNotionPage(
      config.rootPageId,
      targetPageId,
      includeChildPageContent,
    );
  } catch (error) {
    console.error("Failed to load Notion page", {
      pageId: targetPageId,
      error,
    });

    return {
      status: "error",
      message:
        "Could not load the Notion page. Check that the page is shared with your integration and try again.",
    };
  }
}

const loadCachedNotionPage = unstable_cache(
  async (
    rootPageId: string,
    targetPageId: string,
    includeChildPageContent: boolean,
  ): Promise<NotionLoadState> => {
    const token = process.env.NOTION_TOKEN;

    if (!token) {
      throw new Error("Missing NOTION_TOKEN");
    }

    const notion = new Client({ auth: token });
    const page = await notion.pages.retrieve({ page_id: targetPageId });
    const title = getPageTitle(page);
    const blocks = await fetchChildBlocks(notion, targetPageId, {
      includeChildPageContent,
    });

    return {
      status: "success",
      page: {
        title,
        blocks,
      },
    };
  },
  ["notion-page-content-v1"],
  {
    tags: ["notion-pages"],
    revalidate: notionCacheRevalidateSeconds,
  },
);

function readNotionConfig():
  | { ready: true; token: string; rootPageId: string }
  | { ready: false; missingVariables: string[] } {
  const token = process.env.NOTION_TOKEN;
  const rootPageId = process.env.NOTION_ROOT_PAGE_ID;
  const missingVariables = [];

  if (!token) {
    missingVariables.push("NOTION_TOKEN");
  }

  if (!rootPageId) {
    missingVariables.push("NOTION_ROOT_PAGE_ID");
  }

  if (missingVariables.length > 0) {
    return {
      ready: false,
      missingVariables,
    };
  }

  if (!token || !rootPageId) {
    return {
      ready: false,
      missingVariables,
    };
  }

  return {
    ready: true,
    token,
    rootPageId,
  };
}

async function fetchChildBlocks(
  notion: Client,
  blockId: string,
  options: { includeChildPageContent?: boolean } = {},
): Promise<NotionContentBlock[]> {
  const blocks = await listAllChildBlocks(notion, blockId);
  const contentBlocks = await Promise.all(
    blocks.map((block) => normalizeBlock(notion, block, options)),
  );

  return contentBlocks.filter((block) => block !== null);
}

async function listAllChildBlocks(
  notion: Client,
  blockId: string,
): Promise<Array<BlockObjectResponse | PartialBlockObjectResponse>> {
  const blocks: Array<BlockObjectResponse | PartialBlockObjectResponse> = [];
  let startCursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: startCursor,
      page_size: 100,
    });

    blocks.push(...response.results);
    startCursor = response.next_cursor ?? undefined;
  } while (startCursor);

  return blocks;
}

async function normalizeBlock(
  notion: Client,
  block: BlockObjectResponse | PartialBlockObjectResponse,
  options: { includeChildPageContent?: boolean },
): Promise<NotionContentBlock | null> {
  if (!isFullBlock(block)) {
    return null;
  }

  if (block.type === "divider") {
    return {
      id: block.id,
      type: "divider",
    };
  }

  if (block.type === "code") {
    return {
      id: block.id,
      type: "code",
      language: block.code.language,
      text: normalizeRichText(block.id, block.code.rich_text),
    };
  }

  if (block.type === "child_page") {
    const childPage = await notion.pages.retrieve({ page_id: block.id });
    const icon = "icon" in childPage ? normalizePageIcon(childPage.icon) : null;
    const cover = "cover" in childPage ? normalizePageCover(childPage.cover) : null;

    return {
      id: block.id,
      type: "child_page",
      title: block.child_page.title,
      icon,
      cover,
      children:
        options.includeChildPageContent === false
          ? []
          : await fetchChildBlocks(notion, block.id, options),
    };
  }

  if (block.type === "table") {
    return {
      id: block.id,
      type: "table",
      hasColumnHeader: block.table.has_column_header,
      hasRowHeader: block.table.has_row_header,
      rows: await fetchTableRows(notion, block.id),
    };
  }

  if (block.type === "table_of_contents") {
    return { id: block.id, type: "table_of_contents" };
  }

  if (supportedTextBlockTypes.has(block.type as NotionTextBlockType)) {
    const type = block.type as NotionTextBlockType;

    return {
      id: block.id,
      type,
      text: normalizeRichText(block.id, getBlockRichText(block)),
      children: block.has_children
        ? await fetchChildBlocks(notion, block.id, options)
        : [],
    };
  }

  return {
    id: block.id,
    type: "unsupported",
    blockType: block.type,
  };
}

async function fetchTableRows(
  notion: Client,
  blockId: string,
): Promise<NotionTableRow[]> {
  const blocks = await listAllChildBlocks(notion, blockId);

  return blocks.filter(isTableRowBlock).map((row) => ({
    id: row.id,
    cells: row.table_row.cells.map((cell, cellIndex) =>
      normalizeRichText(`${row.id}-${cellIndex}`, cell),
    ),
  }));
}

function isFullBlock(
  block: BlockObjectResponse | PartialBlockObjectResponse,
): block is BlockObjectResponse {
  return "type" in block;
}

function isTableRowBlock(
  block: BlockObjectResponse | PartialBlockObjectResponse,
): block is Extract<BlockObjectResponse, { type: "table_row" }> {
  return isFullBlock(block) && block.type === "table_row";
}

function normalizeRichText(
  blockId: string,
  richText: RichTextItemResponse[],
): NotionRichText[] {
  return richText.map((text, index) => ({
    id: `${blockId}-${index}`,
    plainText: text.plain_text,
    href: text.href,
    bold: text.annotations.bold,
    italic: text.annotations.italic,
    code: text.annotations.code,
    strikethrough: text.annotations.strikethrough,
    underline: text.annotations.underline,
  }));
}

function getBlockRichText(block: BlockObjectResponse): RichTextItemResponse[] {
  switch (block.type) {
    case "paragraph":
      return block.paragraph.rich_text;
    case "heading_1":
      return block.heading_1.rich_text;
    case "heading_2":
      return block.heading_2.rich_text;
    case "heading_3":
      return block.heading_3.rich_text;
    case "bulleted_list_item":
      return block.bulleted_list_item.rich_text;
    case "numbered_list_item":
      return block.numbered_list_item.rich_text;
    case "toggle":
      return block.toggle.rich_text;
    case "quote":
      return block.quote.rich_text;
    case "callout":
      return block.callout.rich_text;
    default:
      return [];
  }
}

function normalizePageIcon(
  icon: PageObjectResponse["icon"],
): import("@/types/notion").NotionPageIcon | null {
  if (!icon) return null;
  if (icon.type === "emoji") return { type: "emoji", emoji: icon.emoji };
  if (icon.type === "external") return { type: "url", url: icon.external.url };
  if (icon.type === "file") return { type: "url", url: icon.file.url };
  return null;
}

function normalizePageCover(
  cover: PageObjectResponse["cover"],
): string | null {
  if (!cover) return null;
  if (cover.type === "external") return cover.external.url;
  if (cover.type === "file") return cover.file.url;
  return null;
}

function getPageTitle(
  page: PageObjectResponse | PartialPageObjectResponse,
): string {
  if (!("properties" in page)) {
    return "Interview Questions";
  }

  for (const property of Object.values(page.properties)) {
    if (property.type === "title" && property.title.length > 0) {
      return property.title.map((text) => text.plain_text).join("");
    }
  }

  return "Interview Questions";
}
