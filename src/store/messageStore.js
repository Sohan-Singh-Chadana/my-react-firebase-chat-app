import { create } from "zustand";

const useMessagesStore = create((set) => ({
  messages: {}, // सभी चैट के मैसेज स्टोर करने के लिए
  isLoading: false,

  setMessages: (chatId, msgs) =>
    set((state) => ({
      messages: { ...state.messages, [chatId]: msgs },
    })),

  setLoading: (isLoading) => set({ isLoading }),

  // ✅ Function to update a specific message
  updateMessage: (chatId, messageId, updateFn) =>
    set((state) => {
      if (!state.messages[chatId]) return state;
      
      return {
        messages: {
          ...state.messages,
          [chatId]: state.messages[chatId].map((msg) => msg.id === messageId ? updateFn(msg) : msg),
        }
      }
    }),
}));

export default useMessagesStore;
