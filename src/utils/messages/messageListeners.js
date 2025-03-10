import {
  collection,
  onSnapshot,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../lib/firebase/firebase";

export const listenForPendingMessages = (chatId, currentUserId) => {
  if (!chatId || !currentUserId) return;

  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(
    messagesRef,
    where("status", "==", "pending"),
    where("senderId", "==", currentUserId)
  );

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const batch = writeBatch(db);

    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        // console.log("📨 New pending message detected. Marking as sent...");
        if (!navigator.onLine) return; // Only update if online
        batch.update(change.doc.ref, { status: "sent" });
      }
    });

    if (!batch._mutations.length) return; // Agar kuch update nahi hai toh batch commit mat karo

    await batch.commit();
    // console.log("✅ All pending messages marked as sent!");
  });

  return unsubscribe;
};

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
