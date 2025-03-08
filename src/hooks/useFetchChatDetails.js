import { useCallback } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";
import { useLastMessageStore, useUnreadStore, useUserStore } from "../store";
import {
  fetchUserData,
  handleDeletedByUpdates,
  listenForLastMessage,
} from "../utils";

const useFetchChatDetails = () => {
  const { currentUser } = useUserStore.getState();
  const { setLastMessageData } = useLastMessageStore();
  const { startUnreadCountListener } = useUnreadStore(); // ✅ Zustand से function ले रहे हैं

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
          setLastMessageData,
          currentUser
        );
        unsubscribeListeners.push(lastMessageUnSub);

        // ✅ Unread Count के लिए Real-time Listener सेट करो
        const unreadCountUnSub = startUnreadCountListener(
          chat.chatId,
          currentUser.uid
        );
        unsubscribeListeners.push(unreadCountUnSub);

        return { ...chat, user };
      } catch (fetchError) {
        console.error(
          "❌ [Error] Fetching chat document failed:",
          chat.chatId,
          fetchError
        );
        return null;
      }
    },
    [currentUser, setLastMessageData, startUnreadCountListener]
  );

  return fetchChatDetails;
};

export default useFetchChatDetails;
