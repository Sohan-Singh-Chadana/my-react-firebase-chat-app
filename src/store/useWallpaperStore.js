import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWallpaperStore = create(
  persist(
    (set) => ({
      selectedWallpaper: "default",
      hoveredWallpaper: null,
      showWallpaperImage: true,

      setSelectedWallpaper: (color) => set({ selectedWallpaper: color }),
      setHoveredWallpaper: (color) => set({ hoveredWallpaper: color }),
      setShowWallpaperImage: () =>
        set((state) => ({ showWallpaperImage: !state.showWallpaperImage })),
    }),
    {
      name: "wallpaper-storage", // Key for local storage
    }
  )
);

export default useWallpaperStore;
