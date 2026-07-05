import {
  bundledLanguages,
  bundledLanguagesAlias,
  codeToHtml,
} from "shiki";

type CodeBlockProps = {
  code: string;
  language: string;
};

export async function CodeBlock({ code, language }: CodeBlockProps) {
  const label = language.trim();
  const html = await codeToHtml(code, {
    lang: normalizeLanguage(language),
    theme: "github-dark",
    defaultColor: false,
    rootStyle: false,
  });

  return (
    <figure className="overflow-hidden rounded-md border border-zinc-200 bg-zinc-950 dark:border-zinc-800 dark:bg-black">
      {label && (
        <figcaption className="border-b border-white/10 px-4 py-2 font-mono text-[0.7rem] uppercase tracking-normal text-zinc-400">
          {label}
        </figcaption>
      )}
      <div
        className="code-block overflow-x-auto px-4 py-3 text-sm leading-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}

function normalizeLanguage(language: string) {
  const normalized = language.trim().toLowerCase();

  if (normalized in bundledLanguages || normalized in bundledLanguagesAlias) {
    return normalized;
  }

  return "text";
}
