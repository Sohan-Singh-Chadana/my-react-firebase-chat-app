import {
  collection,
  getDocs,
  writeBatch,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase/firebase";

export const markMessagesAsSent = async (chatId, receiverId) => {
  if (!chatId || !receiverId) {
    console.warn("markMessagesAsSent: Missing chatId or receiverId");
    return;
  }

  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(
    messagesRef,
    where("status", "==", "pending"),
    where("senderId", "==", receiverId) // Only mark messages for the current user
  );

  try {
    const messagesSnap = await getDocs(q);

    if (messagesSnap.empty) {
      // console.log("No messages to mark as sent");
      return;
    }

    const batch = writeBatch(db);
    messagesSnap.forEach((doc) => {
      batch.update(doc.ref, { status: "sent" });
    });

    await batch.commit();
    console.log("Messages marked as sent");
  } catch (error) {
    console.error(" Error marking messages as sent", error);
  }
};

export const markMessagesAsDelivered = async (chatId, receiverId) => {
  if (!chatId || !receiverId) return;

  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(
    messagesRef,
    where("status", "==", "sent"),
    where("receiverId", "==", receiverId) // Only mark messages for the current user
  );

  try {
    const messagesSnap = await getDocs(q);

    if (messagesSnap.empty) {
      // console.log("No sent messages found to mark as delivered.");
      return;
    }

    const batch = writeBatch(db);
    messagesSnap.forEach((doc) => {
      batch.update(doc.ref, { status: "delivered" });
    });

    await batch.commit();
    // console.log("Messages marked as delivered successfully.");
  } catch (err) {
    console.error("Failed to mark messages as delivered:", err);
  }
};

export const markMessagesAsRead = async (chatId, receiverId) => {
  if (!chatId || !receiverId) return;

  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(
    messagesRef,
    where("status", "==", "delivered"),
    where("receiverId", "==", receiverId) // Only mark messages for the current user
  );

  try {
    const messagesSnap = await getDocs(q);

    if (messagesSnap.empty) {
      // console.log("No delivered messages found to mark as read.");
      return;
    }

    const batch = writeBatch(db);
    messagesSnap.forEach((doc) => {
      batch.update(doc.ref, { status: "read" });
    });

    await batch.commit();
    // console.log("Messages marked as read successfully.");
  } catch (err) {
    console.error("Failed to mark messages as read:", err);
  }
};
