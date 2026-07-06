import type { MetadataRoute } from "next";
import { loadNotionRootPageIndex } from "@/lib/notion";
import type { NotionChildPageBlock, NotionContentBlock } from "@/types/notion";

export const revalidate = 21600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const state = await loadNotionRootPageIndex();

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  if (state.status === "success") {
    const childPages = state.page.blocks.filter(isChildPage);
    for (const page of childPages) {
      entries.push({
        url: `${baseUrl}/pages/${page.id}`,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return entries;
}

function isChildPage(block: NotionContentBlock): block is NotionChildPageBlock {
  return block.type === "child_page";
}
