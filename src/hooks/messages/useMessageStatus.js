import { useEffect } from "react";
import { useChatStore, useSelectChats, useUserStore } from "../../store";
import {
  listenUnreadCount,
  resetUnreadCount,
  setUserActive,
  setUserInactive,
} from "../../utils";
import {
  listenAndMarkMessagesAsRead,
  listenForDeliveredMessages,
  listenForPendingMessages,
} from "../../utils/messages";

export const useMessageStatus = (unreadCount, setUnreadCount) => {
  const { chatId } = useChatStore();
  const { currentUser } = useUserStore();

  const currentUserId = currentUser?.userId;

  useEffect(() => {
    if (chatId && currentUserId) {
      // ✅ Listen to unread messages count
      const unsubscribeUnreadCount = listenUnreadCount(
        chatId,
        currentUserId,
        setUnreadCount
      );
      setUserActive(chatId, currentUserId);

      // ✅ Listen for real-time message updates
      const unsubscribePendingMessages = listenForPendingMessages(
        chatId,
        currentUserId
      ); // 🔥 Listens for "pending" messages and marks them as "sent"

      const unsubscribeDelivered = listenForDeliveredMessages(
        chatId,
        currentUserId
      );
      const unsubscribeRead = listenAndMarkMessagesAsRead(
        chatId,
        currentUserId
      );

      const { chats } = useSelectChats.getState();
      chats.map(async (chat) => {
        if (chatId !== chat.chatId && unreadCount > 0) {
          await resetUnreadCount(chat.chatId, currentUserId);
        }
      });

      return () => {
        unsubscribeUnreadCount();
        unsubscribePendingMessages(); // ✅ Unsubscribe from pending messages listener
        unsubscribeDelivered();
        unsubscribeRead();
        setUserInactive(chatId, currentUserId); // Chat band hone par inactive
      };
    }
  }, [chatId, currentUserId, setUnreadCount, unreadCount]);
};
