import { useEffect, useState } from "react";
import { useChatStore } from "../../store";
import { listenToUserStatus } from "../../services/userStatusService";

export const useUserStatus = () => {
  const [userStatus, setUserStatus] = useState({
    status: "offline",
    lastSeen: null,
  });
  const { chatId, user } = useChatStore.getState();

  const userId = user?.userId;

  useEffect(() => {
    if (chatId && userId) {
      const unsubscribe = listenToUserStatus(userId, setUserStatus);
      return () => unsubscribe();
    }
  }, [chatId, userId]);

  return userStatus;
};
