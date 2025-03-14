import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { useChatStore, useSelectChats, useUserStore } from "../../../store";
import { db, storage } from "../../../lib/firebase/firebase";
import { extractStoragePath } from "../../storageUtils";
import { deleteObject, ref } from "firebase/storage";

export const deleteChatHandler = async (chatIdList) => {
  const { currentUser } = useUserStore.getState();
  const { resetChatId } = useChatStore.getState();
  const { setChats } = useSelectChats.getState();

  if (!chatIdList.length || !currentUser?.userId) return;

  try {
    const batch = writeBatch(db);

    // ✅ Get current user's chatList
    const userRef = doc(db, "users", currentUser.userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn("⚠️ [User] User document not found:", currentUser.userId);
      return;
    }

    const currentChatList = userSnap.data().chatList || [];

    // ✅ Remove selected chats from chatList
    const updatedChatList = currentChatList.filter(
      (chat) => !chatIdList.includes(chat.chatId)
    );

    batch.update(userRef, { chatList: updatedChatList });

    for (const chatId of chatIdList) {
      const chatRef = doc(db, "chats", chatId);
      const messagesRef = collection(db, "chats", chatId, "messages");

      const chatSnap = await getDoc(chatRef);
      if (!chatSnap.exists()) continue; // ✅ Skip this chat since it does not exist

      const chatData = chatSnap.data();
      const deletedBy = chatData.deletedBy || [];
      const updatedDeletedBy = [...new Set([...deletedBy, currentUser.userId])];

      // ✅ Check if messages exist before updating
      const messagesSnap = await getDocs(messagesRef);
      // 🔥 Run deleteForMe for all messages in this chat
      await Promise.all(
        messagesSnap.docs.map(async (msgDoc) => {
          if (!msgDoc.exists()) return; // ✅ Skip if message does not exist

          const messageRef = doc(db, "chats", chatId, "messages", msgDoc.id);
          const messageData = msgDoc.data();
          const updatedDeletedFor = [
            ...(messageData.deletedFor || []),
            currentUser.userId,
          ];

          // ✅ If message is already deleted, avoid updating
          if (messageData.deletedFor?.includes(currentUser.userId)) return;

          if (
            updatedDeletedFor.includes(messageData.senderId) &&
            updatedDeletedFor.includes(messageData.receiverId)
          ) {
            // ✅ If message contains an image, delete it from Firebase Storage
            if (messageData.img) {
              try {
                const imageUrl = messageData.img;
                const storagePath = extractStoragePath(imageUrl);

                if (storagePath) {
                  const imageRef = ref(storage, storagePath);
                  await deleteObject(imageRef);
                }
              } catch (error) {
                console.error(
                  "Error deleting image from Firebase Storage:",
                  error
                );
              }
            }
            await deleteDoc(messageRef);
          } else {
            await updateDoc(messageRef, { deletedFor: updatedDeletedFor });
          }
        })
      );

      // ✅ Update deletedAt timestamp
      const updatedDeletedAt = {
        ...(chatData.deletedAt || {}),
        [currentUser.userId]: serverTimestamp(),
      };

      // ✅ Update chat document with the new deletion status
      batch.update(chatRef, {
        deletedBy: updatedDeletedBy,
        deletedAt: updatedDeletedAt,
      });

      // ✅ If both users deleted the chat, delete it completely
      const participants = chatData.participants || [];
      const allDeleted = participants.every((userId) =>
        updatedDeletedBy.includes(userId)
      );

      if (allDeleted) {
        batch.delete(chatRef);
      }
    }

    await batch.commit(); // Commit batch update

    setChats((state) => ({
      chats: state.chats.filter((chat) => !chatIdList.includes(chat.chatId)),
    }));

    resetChatId();
  } catch (error) {
    console.error("❌ [Error] Failed to delete chat(s):", error);
  }
};
