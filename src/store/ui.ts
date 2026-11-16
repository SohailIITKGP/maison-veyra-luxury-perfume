"use client";

import { create } from "zustand";

interface UiState {
  hydrated: boolean;
  bagOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  bagEverOpened: boolean;
  searchEverOpened: boolean;
  menuEverOpened: boolean;
  /** Most recently added variant, used for the bag drawer confirmation. */
  justAdded?: string;
  setHydrated: () => void;
  openBag: (justAdded?: string) => void;
  closeBag: () => void;
  setSearch: (open: boolean) => void;
  setMenu: (open: boolean) => void;
}

export const useUi = create<UiState>()((set) => ({
  hydrated: false,
  bagOpen: false,
  searchOpen: false,
  menuOpen: false,
  bagEverOpened: false,
  searchEverOpened: false,
  menuEverOpened: false,
  setHydrated: () => set({ hydrated: true }),
  openBag: (justAdded) => set({ bagOpen: true, bagEverOpened: true, justAdded, menuOpen: false, searchOpen: false }),
  closeBag: () => set({ bagOpen: false }),
  setSearch: (searchOpen) => set((s) => ({ searchOpen, menuOpen: false, searchEverOpened: s.searchEverOpened || searchOpen })),
  setMenu: (menuOpen) => set((s) => ({ menuOpen, menuEverOpened: s.menuEverOpened || menuOpen })),
}));
