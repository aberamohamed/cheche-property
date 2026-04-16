import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storage } from "../utils/storage";
import { User } from "../types";

interface AuthState {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  setAuth: (payload: { token: string; user: User }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      setAuth: ({ token, user }) => set({ token, user }),
      logout: () => set({ token: null, user: null })
    }),
    {
      name: "relty-auth",
      storage: createJSONStorage(() => storage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      }
    }
  )
);

export const authStore = useAuthStore;
