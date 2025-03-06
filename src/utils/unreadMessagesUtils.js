import {
  doc,
  getDoc,
  increment,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase/firebase";

// Function to listen for unread message count updates
export const listenUnreadCount = (chatId, userId, setUnreadCount) => {
  const chatRef = doc(db, "chats", chatId);
  return onSnapshot(chatRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      setUnreadCount(data.unreadCount?.[userId] || 0);
    }
  });
};

// Function to reset unread message count
export const resetUnreadCount = async (chatId, currentUserId) => {
  if (!chatId || !currentUserId) return;
  const chatRef = doc(db, "chats", chatId);
  try {
    await updateDoc(chatRef, {
      [`unreadCount.${currentUserId}`]: 0,
    });
  } catch (err) {
    console.error("❌ Error resetting unread count:", err);
  }
};

// Function to increment unread message count
export const updateUnreadCount = async (chatId, receiverId, currentUserId) => {
  const chatRef = doc(db, "chats", chatId);
  try {
    const docSnap = await getDoc(chatRef);
    const data = docSnap.data();
    const isReceiverActive = data.activeUsers?.includes(receiverId) || false;

    const updates = {
      [`unreadCount.${currentUserId}`]: 0, // Sender ka count reset
    };
    if (!isReceiverActive) {
      updates[`unreadCount.${receiverId}`] = increment(1); // Receiver ka count increment jab active nahi
    }

    await updateDoc(chatRef, updates);
  } catch (err) {
    console.error("❌ Error updating unread count:", err);
  }
};
