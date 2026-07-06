import { AlertTriangle } from "lucide-react";

export function SetupState({
  missingVariables,
}: {
  missingVariables: string[];
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-5 py-10 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <section className="w-full max-w-xl rounded-md border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
          Setup Required
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Connect your Notion page
        </h1>
        <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-300">
          Add these environment variables to `.env.local`, then restart the dev
          server.
        </p>
        <ul className="mt-5 space-y-2">
          {missingVariables.map((variable) => (
            <li
              key={variable}
              className="rounded-md bg-zinc-100 px-3 py-2 font-mono text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
            >
              {variable}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-5 py-10 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <section
        role="alert"
        className="relative w-full max-w-xl overflow-hidden rounded-xl border border-rose-200 bg-white p-6 shadow-lg shadow-rose-950/5 dark:border-rose-900/60 dark:bg-zinc-900 dark:shadow-black/20"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 via-amber-400 to-zinc-300 dark:to-zinc-700" />
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/70 dark:bg-rose-950/35 dark:text-rose-300">
            <AlertTriangle className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600 dark:text-rose-300">
              Application Error
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              This page could not be loaded
            </h1>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-300">
              The application hit a problem while loading this content. Refresh the page
              or check the app configuration if this keeps happening.
            </p>
            {message && (
              <p className="mt-5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-400">
                Error details are available in the server logs.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
