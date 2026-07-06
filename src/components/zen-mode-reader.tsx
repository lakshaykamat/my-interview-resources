"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Focus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SETTINGS_KEYS } from "@/lib/settings";

type ZenModeReaderProps = {
  children: ReactNode;
  questionPanels: ReactNode[];
  totalQuestions: number;
};

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function ZenModeReader({
  children,
  questionPanels,
  totalQuestions,
}: ZenModeReaderProps) {
  const [isZenMode, setIsZenMode] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [navbarSlot, setNavbarSlot] = useState<HTMLElement | null>(null);
  const [displayPanels, setDisplayPanels] = useState<ReactNode[]>(questionPanels);

  useEffect(() => {
    setNavbarSlot(document.getElementById("zen-mode-navbar-slot"));
  }, []);
  const hasQuestions = totalQuestions > 0;
  const lastQuestionIndex = Math.max(totalQuestions - 1, 0);
  const visibleIndex = Math.min(activeIndex, lastQuestionIndex);
  const currentQuestionNumber = visibleIndex + 1;

  if (!hasQuestions) {
    return children;
  }

  function showPreviousQuestion() {
    window.scrollTo({ top: 0 });
    setActiveIndex((currentIndex) =>
      Math.max(Math.min(currentIndex, lastQuestionIndex) - 1, 0),
    );
  }

  function showNextQuestion() {
    window.scrollTo({ top: 0 });
    setActiveIndex((currentIndex) =>
      Math.min(Math.min(currentIndex, lastQuestionIndex) + 1, lastQuestionIndex),
    );
  }

  function toggleZenMode() {
    if (!isZenMode) {
      window.scrollTo({ top: 0 });
      setActiveIndex(0);
      const isRandom = window.localStorage.getItem(SETTINGS_KEYS.zenRandom) === "true";
      setDisplayPanels(isRandom ? shuffleArray(questionPanels) : questionPanels);
    }
    setIsZenMode(!isZenMode);
  }

  return (
    <>
      {navbarSlot &&
        createPortal(
          <Button
            type="button"
            variant={isZenMode ? "default" : "outline"}
            size="sm"
            onClick={toggleZenMode}
            aria-pressed={isZenMode}
            title={isZenMode ? "Exit Zen mode" : "Enter Zen mode"}
          >
            <Focus aria-hidden="true" />
            {isZenMode ? "Exit Zen" : "Zen"}
          </Button>,
          navbarSlot,
        )}

      {isZenMode ? (
        <main className="min-h-[calc(100vh-3.5rem)] bg-zinc-50 px-5 py-8 text-zinc-950 sm:px-8 sm:py-12 dark:bg-zinc-950 dark:text-zinc-50">
          <section
            className="mx-auto flex min-h-[calc(100vh-9.5rem)] w-full max-w-3xl flex-col justify-center"
            aria-label="Zen question reader"
          >
            <div className="mb-8">
              <p
                className="text-sm font-medium tabular-nums text-zinc-500 dark:text-zinc-400"
                aria-live="polite"
              >
                Question {currentQuestionNumber} / {totalQuestions}
              </p>
            </div>
            <div>{displayPanels[visibleIndex]}</div>
            <div className="mt-10 flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={showPreviousQuestion}
                disabled={visibleIndex === 0}
                aria-label="Previous question"
                title="Previous question"
              >
                <ChevronLeft aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={showNextQuestion}
                disabled={visibleIndex === lastQuestionIndex}
                aria-label="Next question"
                title="Next question"
              >
                <ChevronRight aria-hidden="true" />
              </Button>
            </div>
          </section>
        </main>
      ) : (
        children
      )}
    </>
  );
}
