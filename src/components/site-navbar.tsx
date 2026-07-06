import Link from "next/link";
import { Settings } from "lucide-react";
import { loadNotionRootPageIndex } from "@/lib/notion";
import type { NotionChildPageBlock, NotionContentBlock } from "@/types/notion";

export async function SiteNavbar() {
  const state = await loadNotionRootPageIndex();
  const pages =
    state.status === "success"
      ? state.page.blocks.filter(isChildPage)
      : [];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-zinc-50/90 px-5 backdrop-blur sm:px-8 dark:border-zinc-800/80 dark:bg-zinc-950/90">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4"
      >
        <Link
          href="/"
          className="group inline-flex shrink-0 items-center gap-3 text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
        >
          <span className="grid size-8 place-items-center rounded-md bg-zinc-950 text-xs font-bold text-white transition-colors group-hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:group-hover:bg-zinc-200">
            IN
          </span>
          <span className="hidden sm:inline">Interview Resources</span>
        </Link>

        {pages.length > 0 && (
          <ul className="hidden min-w-0 flex-1 items-center gap-0.5 overflow-x-auto md:flex">
            {pages.map((page) => (
              <li key={page.id} className="shrink-0">
                <Link
                  href={`/pages/${page.id}`}
                  className="block whitespace-nowrap rounded px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="flex shrink-0 items-center gap-2">
          <div id="zen-mode-navbar-slot" />
          <div id="question-filter-navbar-slot" className="lg:hidden" />
          <div id="table-of-contents-navbar-slot" className="lg:hidden" />
          <Link
            href="/settings"
            className="inline-flex size-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-600"
            aria-label="Settings"
            title="Settings"
          >
            <Settings className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </header>
  );
}

function isChildPage(block: NotionContentBlock): block is NotionChildPageBlock {
  return block.type === "child_page";
}
