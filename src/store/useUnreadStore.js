import { create } from "zustand";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";

export const useUnreadStore = create((set, get) => ({
  unreadCounts: {},

  // ✅ Unread Count को अपडेट करने का function
  setChatUnreadCount: (chatId, count) =>
    set((state) => ({
      unreadCounts: { ...state.unreadCounts, [chatId]: count },
    })),

  // ✅ Listener function जो real-time unread count track करेगा
  startUnreadCountListener: (chatId, currentUserId) => {
    const messagesRef = collection(db, "chats", chatId, "messages");

    const qUnreadCount = query(
      messagesRef,
      where("status", "in", ["sent", "delivered"]),
      where("receiverId", "==", currentUserId)
    );

    // ✅ Real-time Listener सेट करें
    const unsubscribe = onSnapshot(qUnreadCount, (snapshot) => {
      const unreadCount = snapshot.size;
      get().setChatUnreadCount(chatId, unreadCount); // Zustand state update
    });

    return unsubscribe; // Listener को बंद करने के लिए return करो
  },
}));
