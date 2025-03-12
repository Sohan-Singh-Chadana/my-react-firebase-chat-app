import { useEffect, useState } from "react";
import { useChatStore, useUserStore } from "../../store";
import { resetUnreadCount } from "../../utils";

export const useVisibilityChange = () => {
  const { chatId } = useChatStore();
  const { currentUser } = useUserStore();
  const [chatOpened, setChatOpened] = useState(false);

  const currentUserId = currentUser?.userId;

  useEffect(() => {
    if (!chatId || !currentUserId) return;

    // ✅ Mark chat as opened when it is set for the first time
    if (!chatOpened) {
      setChatOpened(true);
    }

    const handleVisibilityOrFocusChange = async () => {
      if (
        chatOpened && // ✅ Only reset if chat was opened before
        (document.visibilityState === "hidden" || document.hasFocus() === false)
      ) {
        await resetUnreadCount(chatId, currentUserId);
      }
    };

    window.addEventListener("blur", handleVisibilityOrFocusChange);
    document.addEventListener(
      "visibilitychange",
      handleVisibilityOrFocusChange
    );

    return () => {
      window.removeEventListener("blur", handleVisibilityOrFocusChange);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityOrFocusChange
      );
    };
  }, [chatId, chatOpened, currentUserId]);
};
