import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";

// Function to mark user as active in chat
export const setUserActive = async (chatId, userId) => {
  const chatRef = doc(db, "chats", chatId);
  try {
    await updateDoc(chatRef, {
      activeUsers: arrayUnion(userId), // User ko active list mein add karo
    });
    // await resetUnreadCount(chatId, userId); // Chat khulte hi unread count reset
  } catch (err) {
    console.error("❌ Error setting user active:", err);
  }
};

// Function to mark user as inactive in chat
export const setUserInactive = async (chatId, userId) => {
  const chatRef = doc(db, "chats", chatId);
  try {
    await updateDoc(chatRef, {
      activeUsers: arrayRemove(userId), // User ko active list se hatao
    });
  } catch (err) {
    console.error("❌ Error setting user inactive:", err);
  }
};
