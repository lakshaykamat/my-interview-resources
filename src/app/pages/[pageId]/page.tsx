import { NotionContent } from "@/components/notion-content";
import { ErrorState, SetupState } from "@/components/notion-page-state";
import {
  TableOfContents,
  type TableOfContentsItem,
} from "@/components/table-of-contents";
import { ZenModeReader } from "@/components/zen-mode-reader";
import { loadNotionPageById } from "@/lib/notion";
import {
  groupBlocksByHeading,
  isHeadingBlock,
  plainRichText,
  type ZenQuestionGroup,
} from "@/lib/zen-mode";
import type { NotionContentBlock } from "@/types/notion";

type PageProps = {
  params: Promise<{
    pageId: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function NotionChildPage({ params }: PageProps) {
  const { pageId } = await params;
  const state = await loadNotionPageById(pageId);

  if (state.status === "setup") {
    return <SetupState missingVariables={state.missingVariables} />;
  }

  if (state.status === "error") {
    return <ErrorState message={state.message} />;
  }

  const headings = collectHeadingItems(state.page.blocks);
  const tableOfContents = buildTableOfContents(headings);
  const zenQuestionGroups = groupBlocksByHeading(state.page.blocks);
  const pageContent = (
    <main className="min-h-screen bg-zinc-50 px-5 py-8 text-zinc-950 sm:px-8 sm:py-12 lg:px-6 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="grid w-full gap-8 lg:grid-cols-[minmax(17rem,1fr)_minmax(0,48rem)_minmax(17rem,1fr)] lg:items-start">
        <TableOfContents items={tableOfContents} totalItems={headings.length} />
        <article className="min-w-0 pb-20 lg:col-start-2">
          <header className="mb-12 border-b border-zinc-200 pb-8 dark:border-zinc-800">
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
              {state.page.title}
            </h1>
          </header>
          <NotionContent blocks={state.page.blocks} />
        </article>
        <div aria-hidden="true" className="hidden lg:block" />
      </div>
    </main>
  );

  if (zenQuestionGroups.length === 0) {
    return pageContent;
  }

  return (
    <ZenModeReader
      totalQuestions={zenQuestionGroups.length}
      questionPanels={zenQuestionGroups.map((group) => (
        <ZenQuestionPanel key={group.question.id} group={group} />
      ))}
    >
      {pageContent}
    </ZenModeReader>
  );
}

type HeadingItem = {
  id: string;
  title: string;
  level: 1 | 2 | 3;
};

function collectHeadingItems(blocks: NotionContentBlock[]): HeadingItem[] {
  return blocks.flatMap((block) => {
    const nestedBlocks = "children" in block ? block.children : [];
    const nestedHeadings = collectHeadingItems(nestedBlocks);

    if (!isHeadingBlock(block)) {
      return nestedHeadings;
    }

    const title = plainRichText(block.text).trim();

    if (!title) {
      return nestedHeadings;
    }

    return [
      {
        id: block.id,
        title,
        level: Number(block.type.slice(-1)) as 1 | 2 | 3,
      },
      ...nestedHeadings,
    ];
  });
}

function buildTableOfContents(headings: HeadingItem[]): TableOfContentsItem[] {
  const roots: TableOfContentsItem[] = [];
  const stack: TableOfContentsItem[] = [];

  for (const heading of headings) {
    const item: TableOfContentsItem = {
      ...heading,
      children: [],
    };

    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }

    const parent = stack[stack.length - 1];

    if (parent) {
      parent.children.push(item);
    } else {
      roots.push(item);
    }

    stack.push(item);
  }

  return roots;
}

function ZenQuestionPanel({ group }: { group: ZenQuestionGroup }) {
  const question =
    plainRichText(group.question.text).trim() || "Untitled question";

  return (
    <section
      aria-labelledby={group.question.id}
      className="space-y-8"
    >
      <h2
        id={group.question.id}
        className="text-balance text-3xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-4xl dark:text-zinc-50"
      >
        {question}
      </h2>
      {group.answerBlocks.length > 0 ? (
        <NotionContent blocks={group.answerBlocks} />
      ) : (
        <p className="rounded-md border border-dashed border-zinc-200 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          No answer content found for this question.
        </p>
      )}
    </section>
  );
}
