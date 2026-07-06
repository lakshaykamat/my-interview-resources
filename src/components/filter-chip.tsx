"use client";

import { cn } from "@/lib/utils";

const CHIP_ACTIVE =
  "border-zinc-900 bg-zinc-900 text-zinc-50 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900";
const CHIP_INACTIVE =
  "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600";

type FilterChipProps = {
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
};

export function FilterChip({ label, count, isActive, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        isActive ? CHIP_ACTIVE : CHIP_INACTIVE,
      )}
    >
      {label}
      {count !== undefined && (
        <span className="rounded-full bg-current/15 px-1 py-px text-[10px] leading-none">
          {count}
        </span>
      )}
    </button>
  );
}
