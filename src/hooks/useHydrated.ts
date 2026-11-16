"use client";

import { useUi } from "@/store/ui";

/** True once persisted stores have been restored from localStorage. */
export function useHydrated() {
  return useUi((s) => s.hydrated);
}
