import { create } from "zustand";

const useMessagesStore = create((set) => ({
  messages: {}, // सभी चैट के मैसेज स्टोर करने के लिए
  setMessages: (chatId, msgs) =>
    set((state) => ({
      messages: { ...state.messages, [chatId]: msgs },
    })),
}));

export default useMessagesStore;
