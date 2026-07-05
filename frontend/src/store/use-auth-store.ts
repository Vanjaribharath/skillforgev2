import { create } from "zustand";

export type SkillForgeUser = {
  id: string;
  organizationId: string;
  email: string;
  fullName: string;
  role: "PLATFORM_ADMIN" | "ORG_ADMIN" | "TRAINER" | "EVALUATOR" | "CANDIDATE";
  status: string;
};

type AuthState = {
  user: SkillForgeUser | null;
  accessToken: string | null;
  hydrated: boolean;
  setSession: (user: SkillForgeUser, accessToken: string) => void;
  logout: () => void;
  hydrate: () => void;
};

const TOKEN_KEY = "executionos.accessToken";
const USER_KEY = "executionos.user";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  hydrated: false,
  setSession: (user, accessToken) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TOKEN_KEY, accessToken);
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    set({ user, accessToken, hydrated: true });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
    }
    set({ user: null, accessToken: null, hydrated: true });
  },
  // Zustand state doesn't survive a page reload on its own; the token/user
  // were previously only readable via localStorage directly (api-client.ts),
  // meaning `user` would reset to null on every refresh even with a still
  // valid token. Call this once on app mount to restore both.
  hydrate: () => {
    if (typeof window === "undefined") {
      set({ hydrated: true });
      return;
    }
    const token = window.localStorage.getItem(TOKEN_KEY);
    const rawUser = window.localStorage.getItem(USER_KEY);
    let user: SkillForgeUser | null = null;
    if (rawUser) {
      try {
        user = JSON.parse(rawUser) as SkillForgeUser;
      } catch {
        window.localStorage.removeItem(USER_KEY);
      }
    }
    set({ user, accessToken: token, hydrated: true });
  },
}));
