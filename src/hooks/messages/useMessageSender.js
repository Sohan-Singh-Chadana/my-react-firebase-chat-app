import { useState } from "react";
import {
  addDoc,
  collection,
  deleteField,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase/firebase";
import { useChatStore, useUserStore } from "../../store";
import { getFormattedDate, updateUnreadCount, upload } from "../../utils";

export const useMessageSender = () => {
  const [text, setText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  // const [img, setImg] = useState({ file: null, url: "" });
  const [media, setMedia] = useState({
    file: null,
    url: "",
    type: "",
  });

  const [document, setDocument] = useState({
    file: null, // ✅ Holds document file
    url: "",
    name: "", // ✅ Document file name
  });

  const { chatId, user } = useChatStore.getState();
  const { currentUser } = useUserStore.getState();

  const currentUserId = currentUser?.userId;
  const receiverId = user?.userId;

  const sendMessage = async () => {
    if (!text && !media.file && !document.file) return false; // ✅ Return false if no message

    if (!currentUserId || !receiverId) {
      console.error("❌ Error: currentUser or user is undefined");
      return false; // ✅ Return false to prevent execution
    }

    let mediaUrl = null;
    let docUrl = null;
    let messageId = null;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const chatRef = doc(db, "chats", chatId);
    const timestamp = new Date();
    const formattedDate = getFormattedDate();

    setSendingMessage(true);

    try {
      // ✅ Handle Image/Video Upload
      if (media.file) {
        // ✅ Calculate image size in KB
        // const fileSizeKB = (media.file.size / 1024).toFixed(1);

        // ✅ Correct File Size Conversion Logic
        const fileSize = media.file.size;

        const formattedSize =
          fileSize >= 1024 * 1024
            ? Math.round(fileSize / (1024 * 1024)) + " MB"
            : Math.round(fileSize / 1024) + " KB";

        // ✅ Show a temporary blurred preview before uploading
        const tempMediaUrl = URL.createObjectURL(media.file);

        const tempMediaMessage = {
          senderId: currentUserId,
          receiverId,
          text: text || "",
          timestamp,
          formattedDate,
          status: "pending",
          deletedFor: [],
          isSending: true,
          media: tempMediaUrl,
          mediaSize: formattedSize,
          mediaType: media.type,
          downloadedBy: [currentUserId],
        };

        // ✅ Add temp message to Firebase (with blurred preview)
        const tempDocRef = await addDoc(messagesRef, tempMediaMessage);
        messageId = tempDocRef.id; // ✅ Firebase se message ID le lo

        // ✅ Upload Image in the background ✅ Upload Image and Get URL
        mediaUrl = await upload(media.file);

        // ✅ Update Message with Final Image URL
        await updateDoc(doc(db, "chats", chatId, "messages", messageId), {
          media: mediaUrl,
          isSending: false,
        });

        await updateUnreadCount(chatId, receiverId, currentUserId);
      }

      // ✅ Handle Document Upload
      else if (document.file) {
        // const fileSizeKB = (document.file.size / 1024).toFixed(1);

        // ✅ Correct File Size Conversion Logic
        const fileSize = document.file.size;

        const formattedSize =
          fileSize >= 1024 * 1024
            ? Math.round(fileSize / (1024 * 1024)) + " MB"
            : Math.round(fileSize / 1024) + " KB";

        // ✅ Extract File Type/Extension
        const fileType = document.file?.name
          ? document.file.name.split(".").pop().toUpperCase()
          : "UNKNOWN";

        const tempMediaUrl = URL.createObjectURL(document.file);

        const tempDocMessage = {
          senderId: currentUserId,
          receiverId,
          text: text || "",
          timestamp,
          formattedDate,
          status: "pending",
          deletedFor: [],
          isSending: true,
          docName: document.name,
          docUrl: tempMediaUrl,
          docSize: formattedSize,
          docType: fileType,
          downloadedBy: [currentUserId],
        };

        const tempDocRef = await addDoc(messagesRef, tempDocMessage);
        messageId = tempDocRef.id; // ✅ Firebase se message ID le lo

        // ✅ Upload Document and Get URL
        docUrl = await upload(document.file);

        // ✅ Update Document URL after Upload
        await updateDoc(doc(db, "chats", chatId, "messages", messageId), {
          docUrl,
          isSending: false,
        });

        await updateUnreadCount(chatId, receiverId, currentUserId);
      } else {
        // ✅ If text-only message, send normally
        const textMessage = {
          senderId: currentUserId,
          receiverId,
          text: text || "",
          timestamp,
          formattedDate,
          status: "pending",
          deletedFor: [],
        };

        await addDoc(messagesRef, textMessage);
        await updateUnreadCount(chatId, receiverId, currentUserId);
      }

      await updateDoc(chatRef, {
        [`deletedAt.${currentUserId}`]: deleteField(),
        [`deletedAt.${receiverId}`]: deleteField(),
      });

      // ✅ Clear States after Sending
      setMedia({ file: null, url: "", type: "" });
      setDocument({ file: null, url: "", name: "" });
      setText("");
      setSendingMessage(false); // ✅ Stop loading spinner

      //   console.log(`✅ Message sent to ${user.name}`);
      return true;
    } catch (err) {
      console.error("❌ Error sending message:", err);
      setSendingMessage(false); // ✅ Stop loading spinner
      return false;
    }
  };

  return {
    sendMessage,
    text,
    setText,
    media,
    setMedia,
    document,
    setDocument,
    sendingMessage,
  };
};
