import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";

const setTypingStatus = async (userId, chatId, isTyping) => {
  if (!userId || !chatId) return;

  try {
    await updateDoc(doc(db, "users", userId), {
      typingStatus: {
        chatId,
        isTyping,
      },
    });
  } catch (err) {
    console.error("❌ Error updating typing status:", err);
  }
};

export default setTypingStatus;
