import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../lib/firebase/firebase";
import { deleteChatWithMessages } from "./deleteChatUtils";
import { useChatStore, useGlobalStateStore, useSelectChats, useUserStore } from "../store";


export const chatDeletionUtils = async () => {
  const { currentUser } = useUserStore.getState();
  const { resetChatId } = useChatStore.getState();
  const { setSelectMode } = useGlobalStateStore.getState();
  const { selectedChats, clearSelectedChats, setChats } =
    useSelectChats.getState();

  if (!Array.isArray(selectedChats) || selectedChats.length === 0) return;

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
      (chat) =>
        !selectedChats.some(
          (selectedChat) => selectedChat.chatId === chat.chatId
        )
    );

    batch.update(userRef, { chatList: updatedChatList });

    for (const selectedChat of selectedChats) {
      const chatRef = doc(db, "chats", selectedChat.chatId);
      const messagesRef = collection(
        db,
        "chats",
        selectedChat.chatId,
        "messages"
      );

      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) continue; // ✅ Skip this chat since it does not exist

      const chatData = chatSnap.data();
      const deletedBy = chatData.deletedBy || [];
      const updatedDeletedBy = [...new Set([...deletedBy, currentUser.userId])];

      // ✅ Check if messages exist before updating
      const messagesSnap = await getDocs(messagesRef);
      messagesSnap.forEach((msgDoc) => {
        if (!msgDoc.exists()) {
          console.warn("⚠️ [Message] Skipping missing message:", msgDoc.id);
          return;
        }

        batch.update(
          doc(db, "chats", selectedChat.chatId, "messages", msgDoc.id),
          {
            deletedBy: updatedDeletedBy,
          }
        );
      });

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

      // ✅ If both users deleted the chat, delete it
      if (
        updatedDeletedBy.includes(currentUser.userId) &&
        updatedDeletedBy.includes(selectedChat.receiverId)
      ) {
        await deleteChatWithMessages(chatRef, messagesRef, batch);
      }
    }

    await batch.commit(); // Commit batch update

    // ✅ Update Zustand state
    setChats((state) => ({
      chats: state.chats.filter(
        (chat) =>
          !selectedChats.some(
            (selectedChat) => selectedChat.chatId === chat.chatId
          )
      ),
    }));

    resetChatId();
    clearSelectedChats();
    setSelectMode(false);
  } catch (err) {
    console.error("❌ [Error] Failed to delete chats:", err);
  }
};
