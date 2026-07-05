import Link from "next/link";
import { NotionContent } from "@/components/notion-content";
import { ErrorState, SetupState } from "@/components/notion-page-state";
import { loadNotionRootPageIndex } from "@/lib/notion";
import type {
  NotionChildPageBlock,
  NotionContentBlock,
} from "@/types/notion";

export const dynamic = "force-dynamic";

export default async function Home() {
  const state = await loadNotionRootPageIndex();

  if (state.status === "setup") {
    return <SetupState missingVariables={state.missingVariables} />;
  }

  if (state.status === "error") {
    return <ErrorState message={state.message} />;
  }

  const childPages = state.page.blocks.filter(isChildPage);
  const introBlocks = state.page.blocks.filter((block) => !isChildPage(block));

  return (
    <main className="min-h-screen bg-zinc-50 px-5 py-10 text-zinc-950 sm:px-8 sm:py-16 dark:bg-zinc-950 dark:text-zinc-50">
      <article className="mx-auto max-w-3xl">
        <header className="mb-10 border-b border-zinc-200 pb-8 dark:border-zinc-800">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            Interview Notes
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
            {state.page.title}
          </h1>
        </header>

        {introBlocks.length > 0 && (
          <section className="mb-10">
            <NotionContent blocks={introBlocks} />
          </section>
        )}

        <section className="space-y-3">
          {childPages.length > 0 ? (
            childPages.map((page) => (
              <Link
                key={page.id}
                href={`/pages/${page.id}`}
                className="block rounded-md border border-zinc-200 bg-white px-5 py-4 transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/70"
              >
                <h2 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                  {page.title}
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Open page
                </p>
              </Link>
            ))
          ) : (
            <p className="rounded-md border border-zinc-200 bg-white px-5 py-4 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              No child pages found inside the configured Notion root page.
            </p>
          )}
        </section>
      </article>
    </main>
  );
}

function isChildPage(
  block: NotionContentBlock,
): block is NotionChildPageBlock {
  return block.type === "child_page";
}
