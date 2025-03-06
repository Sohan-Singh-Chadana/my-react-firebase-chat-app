import { useEffect } from "react";
import { useChatStore, useUserStore } from "../../store";
import { resetUnreadCount } from "../../utils";

export const useVisibilityChange = () => {
  const { chatId } = useChatStore();
  const { currentUser } = useUserStore();

  const currentUserId = currentUser?.userId;

  useEffect(() => {
    if (!chatId || !currentUserId) return;

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "hidden") {
        await resetUnreadCount(chatId, currentUserId);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [chatId, currentUserId]);
};
