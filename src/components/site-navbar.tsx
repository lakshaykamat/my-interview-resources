import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-zinc-50/90 px-5 backdrop-blur sm:px-8 dark:border-zinc-800/80 dark:bg-zinc-950/90">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4"
      >
        <Link
          href="/"
          className="group inline-flex items-center gap-3 text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
        >
          <span className="grid size-8 place-items-center rounded-md bg-zinc-950 text-xs font-bold text-white transition-colors group-hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:group-hover:bg-zinc-200">
            IN
          </span>
          <span>Interview Notes</span>
        </Link>
        <div className="flex items-center gap-2">
          <div id="zen-mode-navbar-slot" />
          <div id="table-of-contents-navbar-slot" className="lg:hidden" />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
