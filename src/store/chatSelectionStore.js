import { create } from "zustand";

const useSelectChats = create((set) => ({
  selectedChats: [],
  chats: [],

  addSelectedChat: (chat) =>
    set((state) => ({
      selectedChats: [...state.selectedChats, chat],
    })),

  removeSelectedChat: (chatId) =>
    set((state) => ({
      selectedChats: state.selectedChats.filter(
        (chat) => chat.chatId !== chatId
      ),
    })),

  clearSelectedChats: () => set({ selectedChats: [] }),

  setChats: (chats) => set({ chats }),
}));

export default useSelectChats;
