import { useCallback, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";
import { useLastMessageStore, useUserStore } from "../store";
import {
  calculateUnreadCount,
  fetchUserData,
  handleDeletedByUpdates,
  listenForLastMessage,
} from "../utils";

const useFetchChatDetails = () => {
  const { currentUser } = useUserStore.getState();
  const { setLastMessageData } = useLastMessageStore();

  const fetchChatDetails = useCallback(
    async (chat, unsubscribeListeners) => {
      const chatsRef = doc(db, "chats", chat.chatId);

      try {
        const chatSnap = await getDoc(chatsRef);
        if (!chatSnap.exists()) return null;

        const chatData = chatSnap.data();
        const user = await fetchUserData(chat.receiverId);
        if (!user) return null;

        await handleDeletedByUpdates(chatData, chatsRef, currentUser.uid);

        const lastMessageUnSub = listenForLastMessage(
          chat.chatId,
          setLastMessageData
        );
        unsubscribeListeners.push(lastMessageUnSub);

        const unreadCount = await calculateUnreadCount(
          chat.chatId,
          currentUser.uid
        );
        return { ...chat, user, unreadCount };
      } catch (fetchError) {
        console.error(
          "❌ [Error] Fetching chat document failed:",
          chat.chatId,
          fetchError
        );
        return null;
      }
    },
    [currentUser.uid, setLastMessageData]
  );

  return fetchChatDetails;
};

export default useFetchChatDetails;
