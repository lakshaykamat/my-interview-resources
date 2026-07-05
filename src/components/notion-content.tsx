import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/code-block";
import type {
  NotionContentBlock,
  NotionRichText,
  NotionTableBlock,
  NotionTableRow,
  NotionTextBlock,
} from "@/types/notion";

type NotionContentProps = {
  blocks: NotionContentBlock[];
};

export function NotionContent({ blocks }: NotionContentProps) {
  return <BlockList blocks={blocks} />;
}

function BlockList({ blocks }: NotionContentProps) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <BlockRenderer key={block.id} block={block} index={index} />
      ))}
    </div>
  );
}

function BlockRenderer({
  block,
  index,
}: {
  block: NotionContentBlock;
  index: number;
}) {
  switch (block.type) {
    case "heading_1":
      return (
        <h1
          id={block.id}
          className="scroll-mt-24 pt-10 text-3xl font-semibold leading-tight tracking-tight text-zinc-950 dark:text-zinc-50"
        >
          <RichText text={block.text} />
        </h1>
      );
    case "heading_2":
      return (
        <h2
          id={block.id}
          className="scroll-mt-24 pt-8 text-2xl font-semibold leading-tight tracking-tight text-zinc-950 dark:text-zinc-50"
        >
          <RichText text={block.text} />
        </h2>
      );
    case "heading_3":
      return (
        <h3
          id={block.id}
          className="scroll-mt-24 pt-5 text-lg font-semibold leading-snug text-zinc-900 dark:text-zinc-100"
        >
          <RichText text={block.text} />
        </h3>
      );
    case "paragraph":
      return <Paragraph block={block} />;
    case "bulleted_list_item":
      return <ListItem block={block} marker={"\u2022"} />;
    case "numbered_list_item":
      return <ListItem block={block} marker={`${index + 1}.`} />;
    case "toggle":
      return <Toggle block={block} />;
    case "quote":
      return (
        <blockquote className="border-l-2 border-zinc-300 pl-4 text-base leading-8 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
          <RichText text={block.text} />
          <NestedBlocks blocks={block.children} />
        </blockquote>
      );
    case "callout":
      return (
        <aside className="rounded-md border border-zinc-200 bg-white px-4 py-3 text-base leading-8 text-zinc-800 shadow-sm shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:shadow-none">
          <RichText text={block.text} />
          <NestedBlocks blocks={block.children} />
        </aside>
      );
    case "code":
      return <CodeBlock code={plainText(block.text)} language={block.language} />;
    case "divider":
      return <hr className="my-10 border-zinc-200 dark:border-zinc-800" />;
    case "child_page":
      return (
        <section className="mt-8 rounded-md border border-zinc-200 bg-white px-5 py-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            {block.title}
          </h2>
          <div className="mt-5">
            <BlockList blocks={block.children} />
          </div>
        </section>
      );
    case "table":
      return <Table block={block} />;
    case "unsupported":
      return (
        <p className="rounded-md border border-dashed border-zinc-200 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          Unsupported Notion block: {block.blockType}
        </p>
      );
  }
}

function Table({ block }: { block: NotionTableBlock }) {
  if (block.rows.length === 0) {
    return null;
  }

  const [headerRow, ...bodyRows] = block.rows;
  const rows = block.hasColumnHeader ? bodyRows : block.rows;

  return (
    <div className="my-6 overflow-x-auto rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <table className="w-full border-collapse text-left text-sm">
        {block.hasColumnHeader && headerRow && (
          <thead className="bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50">
            <TableRow
              row={headerRow}
              hasRowHeader={block.hasRowHeader}
              isColumnHeader
            />
          </thead>
        )}
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {rows.map((row) => (
            <TableRow
              key={row.id}
              row={row}
              hasRowHeader={block.hasRowHeader}
              isColumnHeader={false}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableRow({
  row,
  hasRowHeader,
  isColumnHeader,
}: {
  row: NotionTableRow;
  hasRowHeader: boolean;
  isColumnHeader: boolean;
}) {
  return (
    <tr>
      {row.cells.map((cell, index) => {
        const isHeaderCell = isColumnHeader || (hasRowHeader && index === 0);
        const className = cn(
          "min-w-40 border-r border-zinc-200 px-3 py-2 align-top last:border-r-0 dark:border-zinc-800",
          isHeaderCell
            ? "font-semibold text-zinc-950 dark:text-zinc-50"
            : "font-normal text-zinc-700 dark:text-zinc-300",
        );

        if (isHeaderCell) {
          return (
            <th key={`${row.id}-${index}`} scope="col" className={className}>
              <RichText text={cell} />
            </th>
          );
        }

        return (
          <td key={`${row.id}-${index}`} className={className}>
            <RichText text={cell} />
          </td>
        );
      })}
    </tr>
  );
}

function Paragraph({ block }: { block: NotionTextBlock }) {
  if (block.text.length === 0 && block.children.length === 0) {
    return <div className="h-5" />;
  }

  return (
    <div className="text-pretty text-base leading-8 text-zinc-700 dark:text-zinc-300">
      <RichText text={block.text} />
      <NestedBlocks blocks={block.children} />
    </div>
  );
}

function ListItem({ block, marker }: { block: NotionTextBlock; marker: string }) {
  return (
    <div className="grid grid-cols-[1.5rem_1fr] gap-2 text-base leading-8 text-zinc-700 dark:text-zinc-300">
      <span className="select-none text-zinc-400 dark:text-zinc-600">
        {marker}
      </span>
      <div>
        <RichText text={block.text} />
        <NestedBlocks blocks={block.children} />
      </div>
    </div>
  );
}

function Toggle({ block }: { block: NotionTextBlock }) {
  return (
    <details className="group rounded-md border border-zinc-200 bg-white px-4 py-3 shadow-sm shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
      <summary className="cursor-pointer list-none font-medium text-zinc-900 marker:hidden dark:text-zinc-100">
        <span className="mr-2 inline-block text-zinc-400 transition-transform group-open:rotate-90 dark:text-zinc-500">
          {">"}
        </span>
        <RichText text={block.text} />
      </summary>
      <NestedBlocks blocks={block.children} />
    </details>
  );
}

function NestedBlocks({ blocks }: NotionContentProps) {
  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 border-l border-zinc-200 pl-4 dark:border-zinc-800">
      <BlockList blocks={blocks} />
    </div>
  );
}

function RichText({ text }: { text: NotionRichText[] }) {
  if (text.length === 0) {
    return null;
  }

  return (
    <>
      {text.map((item) => {
        const className = cn(
          item.bold && "font-semibold text-zinc-950 dark:text-zinc-50",
          item.italic && "italic",
          item.underline && "underline underline-offset-2",
          item.strikethrough && "line-through",
          item.code &&
            "rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.9em] text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
        );

        if (item.href) {
          return (
            <a
              key={item.id}
              href={item.href}
              className={cn(
                className,
                "font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-950 dark:text-zinc-50 dark:decoration-zinc-600 dark:hover:decoration-zinc-50",
              )}
              target="_blank"
              rel="noreferrer"
            >
              {item.plainText}
            </a>
          );
        }

        return (
          <span key={item.id} className={className}>
            {item.plainText}
          </span>
        );
      })}
    </>
  );
}

function plainText(text: NotionRichText[]) {
  return text.map((item) => item.plainText).join("");
}
