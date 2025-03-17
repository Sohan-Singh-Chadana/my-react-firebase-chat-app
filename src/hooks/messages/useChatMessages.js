import { useEffect, useRef } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../lib/firebase/firebase";
import { useChatStore, useMessagesStore, useUserStore } from "../../store";

export const useChatMessages = () => {
  const { setMessages } = useMessagesStore();
  const { currentUser } = useUserStore();
  const { chatId } = useChatStore();
  const messagesRef = useRef([]);

  const currentUserId = currentUser?.userId;

  useEffect(() => {
    if (!chatId || !currentUserId) return;

    const messagesCollectionRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesCollectionRef, orderBy("timestamp", "asc"));

    const unSub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ✅ Filter messages deleted for the current user
      const filteredMessages = msgs.filter(
        (msg) => !msg.deletedFor?.includes(currentUserId)
      );

      if (
        JSON.stringify(messagesRef.current) !== JSON.stringify(filteredMessages)
      ) {
        messagesRef.current = filteredMessages;
        setMessages(chatId, filteredMessages); // ✅ Updates Zustand store only if messages change
      }
    });

    return () => unSub();
  }, [chatId, currentUserId, setMessages]);
};
