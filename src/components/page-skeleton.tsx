import { cn } from "@/lib/utils";

type PageSkeletonProps = {
  variant: "index" | "article";
};

export function PageSkeleton({ variant }: PageSkeletonProps) {
  if (variant === "article") {
    return <ArticlePageSkeleton />;
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-5 py-10 text-zinc-950 sm:px-8 sm:py-16 dark:bg-zinc-950 dark:text-zinc-50">
      <article className="mx-auto max-w-3xl">
        <header className="mb-10 border-b border-zinc-200 pb-8 dark:border-zinc-800">
          <SkeletonLine className="mb-4 h-4 w-36" />
          <SkeletonLine className="h-10 w-4/5 sm:h-12" />
        </header>
        <IndexSkeleton />
      </article>
    </main>
  );
}

function ArticlePageSkeleton() {
  return (
    <main className="min-h-screen bg-zinc-50 px-5 py-8 text-zinc-950 sm:px-8 sm:py-12 lg:px-6 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="grid w-full gap-8 lg:grid-cols-[minmax(17rem,1fr)_minmax(0,48rem)_minmax(17rem,1fr)] lg:items-start">
        <aside className="hidden lg:block lg:sticky lg:top-20 lg:col-start-1 lg:w-full lg:max-w-72 lg:justify-self-start">
          <div className="rounded-md border border-zinc-200 bg-white/80 p-3 shadow-sm shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/70 dark:shadow-none">
            <SkeletonLine className="mb-4 h-4 w-24" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonLine
                  key={index}
                  className={cn("h-5", index % 3 === 0 ? "w-11/12" : "w-4/5")}
                />
              ))}
            </div>
          </div>
        </aside>
        <article className="min-w-0 pb-20 lg:col-start-2">
          <SkeletonLine className="mb-8 h-5 w-32" />
          <header className="mb-12 border-b border-zinc-200 pb-8 dark:border-zinc-800">
            <SkeletonLine className="mb-4 h-4 w-36" />
            <SkeletonLine className="h-10 w-4/5 sm:h-12" />
          </header>
          <ArticleSkeleton />
        </article>
        <div aria-hidden="true" className="hidden lg:block" />
      </div>
    </main>
  );
}

function IndexSkeleton() {
  return (
    <section className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="rounded-md border border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <SkeletonLine className="h-5 w-2/3" />
          <SkeletonLine className="mt-3 h-4 w-20" />
        </div>
      ))}
    </section>
  );
}

function ArticleSkeleton() {
  return (
    <section className="space-y-4">
      <SkeletonLine className="h-7 w-3/5" />
      <SkeletonLine className="h-4 w-full" />
      <SkeletonLine className="h-4 w-11/12" />
      <SkeletonLine className="h-4 w-4/5" />
      <div className="py-3">
        <SkeletonLine className="h-6 w-1/2" />
      </div>
      <SkeletonLine className="h-4 w-full" />
      <SkeletonLine className="h-4 w-10/12" />
      <div className="rounded-md border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <SkeletonLine className="h-4 w-5/6" />
        <SkeletonLine className="mt-3 h-4 w-2/3" />
      </div>
    </section>
  );
}

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded bg-zinc-200 dark:bg-zinc-800", className)}
      aria-hidden="true"
    />
  );
}
