import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase/firebase";

const useMessagesStore = create((set) => ({
  messages: {}, // सभी चैट के मैसेज स्टोर करने के लिए
  setMessages: (chatId, msgs) =>
    set((state) => ({
      messages: { ...state.messages, [chatId]: msgs },
    })),

  fetchUnreadCountAndLastMessage: (
    chat,
    currentUser,
    setLastMessage,
    // setUnreadCount
  ) => {
    if (!chat || !currentUser) return;

    // Reference to messages collection
    const messagesRef = collection(db, "chats", chat.chatId, "messages");

    // // Query for unread messages count
    // const qUnread = query(messagesRef, orderBy("timestamp", "desc"));

    // Query for last message (latest one)
    const qLastMessage = query(
      messagesRef,
      orderBy("timestamp", "desc"),
      limit(1)
    );

    // // Listen for unread messages count
    // const unsubscribeUnread = onSnapshot(qUnread, (snapshot) => {
    //   const unreadCount = snapshot.docs.filter(
    //     (doc) =>
    //       doc.data().status === "sent" &&
    //       doc.data().receiverId === currentUser?.uid
    //   ).length;

    //   setUnreadCount(unreadCount);
    // });

    // Listen for last message in real-time
    const unsubscribeLastMessage = onSnapshot(qLastMessage, (snapshot) => {
      if (!snapshot.empty) {
        const lastMessage = snapshot.docs[0].data();
        // setLastMessage({ text: lastMessage.text, status: lastMessage.status });
        setLastMessage(lastMessage);
      } else {
        setLastMessage(null);
      }
    });

    // Return unsubscribe functions to stop listening when needed
    return () => {
      // unsubscribeUnread();
      unsubscribeLastMessage();
    };
  },
}));

export default useMessagesStore;
