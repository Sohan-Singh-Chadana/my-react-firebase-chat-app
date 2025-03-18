import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase/firebase";

export const downloadMessageImage = async (chatId, messageId, currentUser) => {
  try {
    if (!chatId || !messageId || !currentUser?.userId) {
      console.error("❌ Invalid parameters for download.");
      return;
    }

    const messageRef = doc(db, "chats", chatId, "messages", messageId);

    await updateDoc(messageRef, {
      downloadedBy: arrayUnion(currentUser?.userId),
    });

    return true;
  } catch (err) {
    console.error("❌ Error updating download status:", err);
    return false;
  }
};
