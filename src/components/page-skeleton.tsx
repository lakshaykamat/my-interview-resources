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
      {[
        { title: "w-3/5", meta: "w-20" },
        { title: "w-4/5", meta: "w-24" },
        { title: "w-2/3", meta: "w-16" },
        { title: "w-11/12", meta: "w-20" },
        { title: "w-1/2", meta: "w-24" },
      ].map(({ title, meta }, i) => (
        <div
          key={i}
          className="rounded-md border border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <SkeletonLine className={cn("h-5", title)} />
          <SkeletonLine className={cn("mt-3 h-3.5", meta)} />
        </div>
      ))}
    </section>
  );
}

function ArticleSkeleton() {
  return (
    <section className="space-y-4">
      <SkeletonLine className="h-7 w-2/5" />
      <SkeletonLine className="h-4 w-full" />
      <SkeletonLine className="h-4 w-11/12" />
      <SkeletonLine className="h-4 w-4/5" />
      <SkeletonLine className="h-4 w-1/3" />

      <SkeletonImage />

      <div className="pt-2">
        <SkeletonLine className="h-6 w-1/2" />
      </div>
      <SkeletonLine className="h-4 w-full" />
      <SkeletonLine className="h-4 w-10/12" />
      <SkeletonLine className="h-4 w-9/12" />
      <SkeletonLine className="h-4 w-3/5" />

      <div className="rounded-md border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <SkeletonLine className="h-4 w-5/6" />
        <SkeletonLine className="mt-3 h-4 w-2/3" />
      </div>

      <SkeletonLine className="h-4 w-full" />
      <SkeletonLine className="h-4 w-3/4" />
    </section>
  );
}

function SkeletonImage({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative my-4 aspect-video overflow-hidden rounded-md bg-zinc-200 dark:bg-zinc-800",
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/10" />
    </div>
  );
}

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800",
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/10" />
    </div>
  );
}
