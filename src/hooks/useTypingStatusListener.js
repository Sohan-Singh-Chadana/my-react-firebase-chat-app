import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase/firebase"; // Adjust the path as per your project structure
import { useChatStore } from "../lib/chatStore";

const useTypingStatusListener = (userId) => {
  const [typingStatus, setTypingStatus] = useState(null);
  const { chatId } = useChatStore();

  useEffect(() => {
    if (!userId || !chatId) return;

    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        if (userData.typingStatus?.chatId === chatId) {
          setTypingStatus(userData.typingStatus);
        } else {
          setTypingStatus(null);
        }
      }
    });

    return () => unsubscribe();
  }, [userId, chatId]);

  return typingStatus;
};

export default useTypingStatusListener;
