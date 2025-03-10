import { useEffect } from "react";
import { useChatStore, useUserStore } from "../../store";
import { listenForNewMessages, markAllMessagesAsDelivered } from "../../utils";
import {
  listenAndMarkMessagesAsRead,
  listenForDeliveredMessages,
} from "../../utils/messages";

const useChatListeners = () => {
  const { chatId } = useChatStore();
  const { currentUser } = useUserStore();

  const currentUserId = currentUser?.userId;

  useEffect(() => {
    let unsubscribeDelivered = null;
    let unsubscribeRead = null;
    let chatListeners = [];

    if (currentUserId) {
      // 🔥 Mark all messages as delivered when the app opens
      markAllMessagesAsDelivered(currentUserId);

      // 🔥 Run again when user comes online
      const handleOnline = () => markAllMessagesAsDelivered(currentUserId);
      window.addEventListener("online", handleOnline);

      // ✅ Start real-time listener for new messages
      (async () => {
        chatListeners = await listenForNewMessages(currentUserId);
      })();

      // ✅ Listen for delivered & read messages when a chat is open
      if (chatId) {
        unsubscribeDelivered = listenForDeliveredMessages(
          chatId,
          currentUserId
        );
        unsubscribeRead = listenAndMarkMessagesAsRead(chatId, currentUserId);
      }

      return () => {
        window.removeEventListener("online", handleOnline);
        unsubscribeDelivered?.();
        unsubscribeRead?.();

        // ✅ Properly remove all real-time chat listeners
        chatListeners.forEach((unsubscribe) => unsubscribe());
      };
    }
  }, [chatId, currentUserId]);
};

export default useChatListeners;
