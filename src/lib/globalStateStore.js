import { create } from "zustand";

const useGlobalStateStore = create((set) => ({
  selectMode: false,
  addMode: false,
  showDetail: false,
  searchInput: "",
  chats: [],

  // actions update state
  setSelectMode: (mode) => set({ selectMode: mode }),
  setAddMode: (mode) => set({ addMode: mode }),
  setShowDetail: (mode) => set({ showDetail: mode }),
  setSearchInput: (input) => set({ searchInput: input }),
  setChats: (chats) => set({ chats }),
}));

export default useGlobalStateStore;
