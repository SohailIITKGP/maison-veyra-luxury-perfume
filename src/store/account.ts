"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * DEMO SESSION ONLY. This is not authentication: nothing is verified and
 * passwords are never stored. Production would use a real identity provider
 * (e.g. Auth.js, Clerk or Shopify customer accounts).
 */
export interface DemoUser {
  firstName: string;
  lastName: string;
  email: string;
  memberSince: string;
}

interface AccountState {
  user: DemoUser | null;
  signIn: (user: DemoUser) => void;
  signOut: () => void;
}

export const useAccount = create<AccountState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (user) => set({ user }),
      signOut: () => set({ user: null }),
    }),
    { name: "veyra-demo-session", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);
