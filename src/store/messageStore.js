import { create } from "zustand";

const useMessagesStore = create((set) => ({
  messages: {}, // सभी चैट के मैसेज स्टोर करने के लिए
  isLoading: false,

  setMessages: (chatId, msgs) =>
    set((state) => ({
      messages: { ...state.messages, [chatId]: msgs },
    })),

  setLoading: (isLoading) => set({ isLoading }),
}));

export default useMessagesStore;
