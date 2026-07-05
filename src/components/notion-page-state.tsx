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
      <section className="w-full max-w-xl rounded-md border border-red-200 bg-white p-6 dark:border-red-950 dark:bg-zinc-900">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-red-500">
          Notion Error
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          The page could not be loaded
        </h1>
        <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-300">
          {message}
        </p>
      </section>
    </main>
  );
}
