import { create } from "zustand";

const useVisibleComponentStore = create((set) => ({
  visibleComponent: {
    list: true,
    settings: false,
    profile: false,
  },
  toggleComponent: (component) => set({
    visibleComponent: {
      list: component === "list",
      settings: component === "settings",
      profile: component === "profile",
    },
  }),
}));

export default useVisibleComponentStore;