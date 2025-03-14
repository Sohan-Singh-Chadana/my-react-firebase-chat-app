import { useState } from "react";
import {
  addDoc,
  collection,
  deleteField,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase/firebase";
import { useChatStore, useUserStore } from "../../store";
import { getFormattedDate, updateUnreadCount, upload } from "../../utils";

export const useMessageSender = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState({ file: null, url: "" });
  const [sendingImage, setSendingImage] = useState(false);

  const { chatId, user } = useChatStore.getState();
  const { currentUser } = useUserStore.getState();

  const currentUserId = currentUser?.userId;
  const receiverId = user?.userId;

  const sendMessage = async () => {
    if (!text && !img.file) return false; // ✅ Return false if no message

    if (!currentUserId || !receiverId) {
      console.error("❌ Error: currentUser or user is undefined");
      return false; // ✅ Return false to prevent execution
    }

    let imgUrl = null;
    let messageId = null;
    try {
      if (img.file) {
        setSendingImage(true);
        imgUrl = await upload(img.file);
      }

      const messagesRef = collection(db, "chats", chatId, "messages");
      const chatRef = doc(db, "chats", chatId);

      const timestamp = new Date();
      const formattedDate = getFormattedDate();

      const newMessage = {
        senderId: currentUserId,
        receiverId,
        text: text || "",
        timestamp,
        formattedDate,
        status: "pending",
        deletedFor: [],
        ...(imgUrl && { img: imgUrl, isSending: true }),
      };

      const docRef = await addDoc(messagesRef, newMessage);
      messageId = docRef.id; // ✅ Firebase se message ID le lo

      await updateUnreadCount(chatId, receiverId, currentUserId);

      await updateDoc(chatRef, {
        [`deletedAt.${currentUserId}`]: deleteField(),
        [`deletedAt.${receiverId}`]: deleteField(),
      });

      // ✅ Ab Firebase me "isSending: false" update karo (upload complete hone ke baad)
      if (messageId) {
        await updateDoc(doc(db, "chats", chatId, "messages", messageId), {
          isSending: false,
        });
      }

      setImg({ file: null, url: "" });
      setText("");
      setSendingImage(false); // ✅ Stop loading spinner

      //   console.log(`✅ Message sent to ${user.name}`);
      return true;
    } catch (err) {
      console.error("❌ Error sending message:", err);
      setSendingImage(false); // ✅ Stop loading spinner
      return false;
    }
  };

  return {
    sendMessage,
    text,
    setText,
    img,
    setImg,
    sendingImage,
  };
};
