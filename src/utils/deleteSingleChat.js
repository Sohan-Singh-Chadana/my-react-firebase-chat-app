import {
    collection,
    doc,
    getDoc,
    getDocs,
    serverTimestamp,
    writeBatch,
  } from "firebase/firestore";
  import { db } from "../lib/firebase/firebase";
  import useSelectChats from "../store/chatSelectionStore";
  import { useChatStore } from "../store/chatStore";
  import { useUserStore } from "../store/userStore";
  import { deleteChatWithMessages } from "./deleteChatUtils";
  
  export const deleteSingleChat = async () => {
    const { currentUser } = useUserStore.getState();
    const { chatId, resetChatId } = useChatStore.getState();
    const { setChats } = useSelectChats.getState();
  
    if (!chatId || !currentUser?.userId) return;
  
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
  
      // ✅ Remove chat from current user's chatList
      const updatedChatList = currentChatList.filter(
        (chat) => chat.chatId !== chatId
      );
  
      batch.update(userRef, { chatList: updatedChatList });
  
      // ✅ Update chat document (but don't delete it completely)
      const chatRef = doc(db, "chats", chatId);
      const messagesRef = collection(db, "chats", chatId, "messages");
  
      const chatSnap = await getDoc(chatRef);
      if (!chatSnap.exists()) return;
  
      const chatData = chatSnap.data();
      const deletedBy = chatData.deletedBy || [];
      const updatedDeletedBy = [...new Set([...deletedBy, currentUser.userId])];
  
      // ✅ Mark messages as deleted for the current user
      const messagesSnap = await getDocs(messagesRef);
      messagesSnap.forEach((msgDoc) => {
        if (!msgDoc.exists()) return;
        batch.update(doc(db, "chats", chatId, "messages", msgDoc.id), {
          deletedBy: updatedDeletedBy,
        });
      });
  
      // ✅ Update deletedAt timestamp for current user only
      const updatedDeletedAt = {
        ...(chatData.deletedAt || {}),
        [currentUser.userId]: serverTimestamp(),
      };
  
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
        await deleteChatWithMessages(chatRef, messagesRef, batch);
      }
  
      await batch.commit();
  
      // ✅ Update Zustand state (only for current user)
      setChats((state) => ({
        chats: state.chats.filter((chat) => chat.chatId !== chatId),
      }));
  
      resetChatId();
    } catch (err) {
      console.error("❌ [Error] Failed to delete chat:", err);
    }
  };
  