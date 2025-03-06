import { create } from "zustand";

const useLastMessageStore = create((set) => ({
  lastMessageData: {}, // Initial state

  // ✅ Function to update lastMessageData
  setLastMessageData: (chatId, message) =>
    set((state) => ({
      lastMessageData: {
        ...state.lastMessageData,
        [chatId]: message,
      },
    })),
}));

export default useLastMessageStore; 