import {
  arrayRemove,
  arrayUnion,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase/firebase";

// Function to mark user as active in chat
export const setUserActive = async (chatId, userId) => {
  const chatRef = doc(db, "chats", chatId);

  try {
    const chatSnap = await getDoc(chatRef);
    if (!chatSnap.exists()) return;

    await updateDoc(chatRef, {
      activeUsers: arrayUnion(userId),
    });
  } catch (err) {
    console.error("❌ Error setting user active:", err);
  }
};

// Function to mark user as inactive in chat
export const setUserInactive = async (chatId, userId) => {
  const chatRef = doc(db, "chats", chatId);

  try {
    const chatSnap = await getDoc(chatRef);
    if (!chatSnap.exists()) return;

    await updateDoc(chatRef, {
      activeUsers: arrayRemove(userId),
    });
  } catch (err) {
    console.error("❌ Error setting user inactive:", err);
  }
};
