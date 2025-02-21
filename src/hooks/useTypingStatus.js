import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase/firebase"; // Adjust the path as per your project structure

export const setTypingStatus = async (userId, chatId, isTyping) => {
  if (!userId || !chatId) return;

  try {
    await updateDoc(doc(db, "users", userId), {
      typingStatus: {
        chatId,
        isTyping,
      },
    });
    // console.log(`✅ User ${userId} typing status updated`);
  } catch (err) {
    console.error("❌ Error updating typing status:", err);
  }
};
