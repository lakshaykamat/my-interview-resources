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
    <main className="min-h-screen bg-zinc-950 px-5 py-12 text-zinc-50 sm:px-8 sm:py-16">
      <article className="mx-auto max-w-4xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            {state.page.title}
          </h1>
          <div className="mt-5 h-px bg-zinc-800" />
        </header>

        {introBlocks.length > 0 && (
          <section className="mb-8 text-zinc-400">
            <NotionContent blocks={introBlocks} />
          </section>
        )}

        {childPages.length > 0 ? (
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {childPages.map((page, index) => (
              <Link
                key={page.id}
                href={`/pages/${page.id}`}
                className="group relative flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-800/80"
              >
                {/* Index number */}
                <span className="absolute right-5 top-5 text-xs font-mono text-zinc-600 group-hover:text-zinc-500">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-xl group-hover:bg-zinc-700">
                  {page.icon ? (
                    page.icon.type === "emoji" ? (
                      <span>{page.icon.emoji}</span>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={page.icon.url} alt="" className="h-5 w-5" />
                    )
                  ) : (
                    <span className="text-zinc-500">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="2" y="2" width="12" height="2" rx="1" fill="currentColor" opacity="0.5" />
                        <rect x="2" y="6" width="8" height="2" rx="1" fill="currentColor" opacity="0.4" />
                        <rect x="2" y="10" width="10" height="2" rx="1" fill="currentColor" opacity="0.3" />
                      </svg>
                    </span>
                  )}
                </div>

                {/* Title */}
                <div className="min-w-0 flex-1 pr-6">
                  <h2 className="truncate text-sm font-semibold text-zinc-100 group-hover:text-white">
                    {page.title}
                  </h2>
                </div>

                {/* Arrow */}
                <svg
                  className="absolute right-5 bottom-5 h-3.5 w-3.5 text-zinc-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-zinc-400"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M2 7h10M7 2l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            ))}
          </section>
        ) : (
          <p className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-sm text-zinc-500">
            No child pages found inside the configured Notion root page.
          </p>
        )}
      </article>
    </main>
  );
}

function isChildPage(
  block: NotionContentBlock,
): block is NotionChildPageBlock {
  return block.type === "child_page";
}
