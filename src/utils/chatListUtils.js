import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase/firebase";

//* Fetch user data from Firestore
export const fetchUserData = async (receiverId) => {
  try {
    const userDocRef = doc(db, "users", receiverId);
    const userDocSnap = await getDoc(userDocRef);
    return userDocSnap.exists() ? userDocSnap.data() : null;
  } catch (err) {
    console.error("❌ [Error] Error fetching user data:", err);
    return null;
  }
};

//* Handle updates to the `deletedBy` array in chat data
export const handleDeletedByUpdates = async (
  chatData,
  chatsRef,
  currentUserId
) => {
  if (chatData.deletedBy?.includes(currentUserId)) {
    const updatedDeletedBy = chatData.deletedBy.filter(
      (id) => id !== currentUserId
    );
    if (updatedDeletedBy.length !== chatData.deletedBy.length) {
      await updateDoc(chatsRef, { deletedBy: updatedDeletedBy });
    }
  }
};

//* Listen for the last message in a chat
export const listenForLastMessage = (chatId, setLastMessageData) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const qLastMessage = query(
    messagesRef,
    orderBy("timestamp", "desc"),
    limit(1)
  );

  return onSnapshot(qLastMessage, (snapshot) => {
    if (!snapshot.empty) {
      const lastMessage = snapshot.docs[0].data();
      setLastMessageData(chatId, lastMessage);
    } else {
      setLastMessageData(chatId, null);
    }
  });
};

//* Calculate unread messages count
export const calculateUnreadCount = async (chatId, currentUserId) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const qUnreadCount = query(
    messagesRef,
    where("status", "in", ["sent", "delivered"]),
    where("receiverId", "==", currentUserId)
  );
  const messagesSnap = await getDocs(qUnreadCount);
  return messagesSnap.size;
};

//*  Sort chats by timestamp
export const sortChatsByTimestamp = (a, b) =>
  (b.updatedAt?.seconds ?? 0) - (a.updatedAt?.seconds ?? 0);