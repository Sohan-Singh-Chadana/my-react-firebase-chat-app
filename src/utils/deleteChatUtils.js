import { getDocs } from "firebase/firestore";
import { deletePhotoFromStorage } from "./deletePhotoFromStorage";

export const deleteChatWithMessages = async (chatRef, messagesRef, batch) => {
  const messagesSnap = await getDocs(messagesRef);

  for (const message of messagesSnap.docs) {
    const messageData = message.data();
    if (messageData.img) {
      // ✅ If the message has an image, delete it from Firebase Storage
      await deletePhotoFromStorage(messageData.img);
    }
    batch.delete(message.ref); // ✅ Delete the message
  }

  batch.delete(chatRef); // ✅ Delete the chat document
};
