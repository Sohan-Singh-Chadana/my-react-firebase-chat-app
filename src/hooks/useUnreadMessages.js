// useUnreadMessages.js
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase/firebase"; // Adjust the path as needed

const useUnreadMessages = (chatId, currentUserId) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!chatId || !currentUserId) {
      console.error("⛔ [Error] chatId or currentUserId is undefined!");
      return;
    }

    const messagesRef = collection(db, "chats", chatId, "messages");
    const qUnreadCount = query(
      messagesRef,
      where("status", "in", ["sent", "delivered"]),
      where("receiverId", "==", currentUserId)
    );

    // Real-time listener for unread messages
    const unsubscribe = onSnapshot(qUnreadCount, (snapshot) => {
      setUnreadCount(snapshot.size); // Update unread count in real-time
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [chatId, currentUserId]);

  return unreadCount;
};

export default useUnreadMessages;
