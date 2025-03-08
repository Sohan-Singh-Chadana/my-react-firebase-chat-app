import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase/firebase";
import { useChatStore, useUserStore } from "../store";

export const updateLastMessageAfterDeletion = async (
  chatId,
  userSpecificUpdate = false
) => {
  const { currentUser } = useUserStore.getState();
  const { user } = useChatStore.getState();

  if (!chatId || !currentUser || !user) return;

  const currentUserId = currentUser.userId;
  const receiverId = user.userId;

  const senderRef = doc(db, "users", currentUserId);
  const receiverRef = doc(db, "users", receiverId);

  const messagesRef = collection(db, "chats", chatId, "messages");
  const messagesQuery = query(messagesRef, orderBy("timestamp", "desc"));
  const messagesSnap = await getDocs(messagesQuery);

  let lastMessage = "No messages yet";
  let updatedAt = new Date();

  for (const msgDoc of messagesSnap.docs) {
    const messageData = msgDoc.data();

    // ✅ Skip if message is deleted for both users
    if (messageData.deletedFor?.length >= 2) continue;

    // ✅ Fix: Check if currentUser has deleted this message
    if (messageData.deletedFor?.includes(currentUserId)) continue;

    lastMessage = messageData.text || "📷 Photo";
    updatedAt = messageData.timestamp?.toDate() || new Date();
    break;
  }

  // ✅ Function to update user's chatList
  const updateChatList = async (userRef) => {
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const chatList = userData.chatList || [];

    const updatedChatList = chatList.map((chat) =>
      chat.chatId === chatId ? { ...chat, lastMessage, updatedAt } : chat
    );

    await updateDoc(userRef, { chatList: updatedChatList });
  };

  if (userSpecificUpdate) {
    // ✅ Only update for currentUser in DeleteForMe case
    await updateChatList(senderRef);
  } else {
    // ✅ Update for both users in DeleteForEveryone case
    await Promise.all([updateChatList(senderRef), updateChatList(receiverRef)]);
  }
};
