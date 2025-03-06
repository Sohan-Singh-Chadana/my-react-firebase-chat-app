import { useEffect, useState } from "react";
import { listenToUserStatus } from "../../services/userStatusService";
import { useChatStore } from "../../store";

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
