import { create } from "zustand";

const useSettingStore = create((set) => ({
  activeSetting: null,

  openSetting: (setting) => set({ activeSetting: setting }),
  closeSetting: () => set({ activeSetting: null }),
}));

export default useSettingStore;
