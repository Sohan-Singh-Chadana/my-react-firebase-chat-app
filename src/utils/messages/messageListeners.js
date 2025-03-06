import {
  collection,
  onSnapshot,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../lib/firebase/firebase";

export const listenForDeliveredMessages = (chatId, currentUserId) => {
  if (!chatId || !currentUserId) return;

  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(
    messagesRef,
    where("status", "==", "sent"),
    where("receiverId", "==", currentUserId)
  );

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const batch = writeBatch(db);
    snapshot.docChanges().forEach(({ type, doc }) => {
      if (type === "added") {
        batch.update(doc.ref, { status: "delivered" });
      }
    });
    await batch.commit();
  });

  return unsubscribe;
};

export const listenAndMarkMessagesAsRead = (chatId, currentUserId) => {
  if (!chatId || !currentUserId) return;

  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(
    messagesRef,
    where("status", "in", ["sent", "delivered"]),
    where("receiverId", "==", currentUserId)
  );

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const batch = writeBatch(db);
    snapshot.docChanges().forEach(({ type, doc }) => {
      if (type === "added") {
        batch.update(doc.ref, { status: "read" });
      }
    });
    await batch.commit();
  });

  return unsubscribe;
};
