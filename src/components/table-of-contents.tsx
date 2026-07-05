"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type TableOfContentsItem = {
  id: string;
  title: string;
  level: 1 | 2 | 3;
  children: TableOfContentsItem[];
};

type TableOfContentsProps = {
  items: TableOfContentsItem[];
  totalItems: number;
};

export function TableOfContents({
  items,
  totalItems,
}: TableOfContentsProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [navbarSlot] = useState<HTMLElement | null>(() => {
    if (typeof document === "undefined") {
      return null;
    }

    return document.getElementById("table-of-contents-navbar-slot");
  });

  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {navbarSlot &&
        createPortal(
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="inline-flex size-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-600"
            aria-label={`Open table of contents with ${totalItems} sections`}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-table-of-contents"
            title="Open table of contents"
          >
            <Menu className="size-4" aria-hidden="true" />
          </button>,
          navbarSlot,
        )}

      {isMobileOpen && (
        <div className="fixed inset-0 z-[60] bg-zinc-950/45 dark:bg-black/60 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close table of contents"
          />
          <nav
            id="mobile-table-of-contents"
            aria-label="Mobile table of contents"
            className="relative flex h-dvh w-[min(22rem,calc(100vw-2rem))] flex-col border-r border-zinc-200 bg-white shadow-2xl shadow-zinc-950/10 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/30"
          >
            <div className="flex h-14 items-center justify-between gap-3 border-b border-zinc-200 px-4 dark:border-zinc-800">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                Contents
              </h2>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-600"
                aria-label="Close table of contents"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              <TableOfContentsList
                items={items}
                constrainHeight={false}
                onNavigate={() => setIsMobileOpen(false)}
              />
            </div>
          </nav>
        </div>
      )}

      <aside className="hidden min-w-0 lg:sticky lg:top-20 lg:col-start-1 lg:block lg:w-full lg:max-w-72 lg:justify-self-start">
        <TableOfContentsNav items={items} totalItems={totalItems} />
      </aside>
    </>
  );
}

function TableOfContentsNav({
  items,
  totalItems,
}: TableOfContentsProps) {
  return (
    <nav
      aria-label="Table of contents"
      className="rounded-md border border-zinc-200 bg-white/80 p-2 shadow-sm shadow-zinc-200/50 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70 dark:shadow-none"
    >
      <div className="mb-2 flex items-center justify-between gap-3 px-2 py-1">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
          Contents
        </h2>
        <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-medium tabular-nums text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          {totalItems}
        </span>
      </div>
      <TableOfContentsList items={items} />
    </nav>
  );
}

function TableOfContentsList({
  items,
  constrainHeight = true,
  depth = 0,
  onNavigate,
}: {
  items: TableOfContentsItem[];
  constrainHeight?: boolean;
  depth?: number;
  onNavigate?: () => void;
}) {
  return (
    <ol
      className={cn(
        depth === 0 && "space-y-1 pb-1",
        depth === 0 &&
          constrainHeight &&
          "max-h-72 overflow-y-auto lg:max-h-[calc(100vh-7rem)] lg:pb-0",
        depth > 0 &&
          "mt-1 space-y-1 border-l border-zinc-200 pl-3 dark:border-zinc-800",
      )}
    >
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            onClick={onNavigate}
            className={cn(
              "block rounded-md px-2.5 py-1.5 text-sm leading-5 transition-colors",
              item.level === 1 && "font-medium text-zinc-800 dark:text-zinc-200",
              item.level === 2 && "text-zinc-600 dark:text-zinc-300",
              item.level === 3 && "text-zinc-500 dark:text-zinc-400",
              "hover:bg-zinc-100 hover:text-zinc-950 focus-visible:bg-zinc-100 focus-visible:text-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:bg-zinc-800 dark:focus-visible:text-zinc-50",
            )}
          >
            <span className="line-clamp-2">{item.title}</span>
          </a>
          {item.children.length > 0 && (
            <TableOfContentsList
              items={item.children}
              constrainHeight={constrainHeight}
              depth={depth + 1}
              onNavigate={onNavigate}
            />
          )}
        </li>
      ))}
    </ol>
  );
}
