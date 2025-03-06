import { useEffect, useRef } from "react";
import setTypingStatus from "../../services/typingStatusService";
import { useChatStore, useUserStore } from "../../store";

export const useTypingStatus = (text) => {
  const { chatId } = useChatStore();
  const { currentUser } = useUserStore();

  const currentUserId = currentUser?.userId;
  const typingTimeoutRef = useRef(null);

  // Track typing status
  useEffect(() => {
    if (text.trim()) {
      // User is typing
      setTypingStatus(currentUserId, chatId, true);

      // Clear typing status after 3 seconds of inactivity
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setTypingStatus(currentUserId, chatId, false);
      }, 3000);
    } else {
      // User stopped typing
      setTypingStatus(currentUserId, chatId, false);
    }

    return () => clearTimeout(typingTimeoutRef.current);
  }, [text, chatId, currentUserId]);
};
