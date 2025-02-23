import { create } from "zustand";

const useMenuStore = create((set) => ({
  menus: {}, // ✅ Multiple menus stored as an object

  setMenuOpen: (menuId, value) =>
    set((state) => ({
      menus: { ...state.menus, [menuId]: value },
    })),
}));
export default useMenuStore;
