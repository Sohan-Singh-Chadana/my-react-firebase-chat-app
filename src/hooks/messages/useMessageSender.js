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
    try {
      if (img.file) imgUrl = await upload(img.file);

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
        ...(imgUrl && { img: imgUrl }),
      };

      await addDoc(messagesRef, newMessage);

      await updateUnreadCount(chatId, receiverId, currentUserId);

      await updateDoc(chatRef, {
        [`deletedAt.${currentUserId}`]: deleteField(),
        [`deletedAt.${receiverId}`]: deleteField(),
      });

      setImg({ file: null, url: "" });
      setText("");

      //   console.log(`✅ Message sent to ${user.name}`);
      return true;
    } catch (err) {
      console.error("❌ Error sending message:", err);
      return false;
    }
  };

  return {
    sendMessage,
    text,
    setText,
    img,
    setImg,
  };
};
