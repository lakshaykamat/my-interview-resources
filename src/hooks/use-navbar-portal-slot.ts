"use client";

import { useState } from "react";

export function useNavbarPortalSlot(slotId: string) {
  const [slot] = useState<HTMLElement | null>(() => {
    if (typeof document === "undefined") {
      return null;
    }

    return document.getElementById(slotId);
  });

  return slot;
}
