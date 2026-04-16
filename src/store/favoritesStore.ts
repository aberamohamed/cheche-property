import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storage } from "../utils/storage";

interface FavoritesState {
  ids: string[];
  toggleFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggleFavorite: (propertyId) =>
        set((state) => ({
          ids: state.ids.includes(propertyId)
            ? state.ids.filter((item) => item !== propertyId)
            : [...state.ids, propertyId]
        })),
      isFavorite: (propertyId) => get().ids.includes(propertyId),
      clearFavorites: () => set({ ids: [] })
    }),
    {
      name: "relty-favorites",
      storage: createJSONStorage(() => storage)
    }
  )
);
