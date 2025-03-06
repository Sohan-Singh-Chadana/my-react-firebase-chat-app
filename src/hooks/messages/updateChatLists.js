import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase/firebase";
import { useChatStore, useSelectChats, useUserStore } from "../../store";

export const updateChatLists = async (text) => {
  const { chatId, user } = useChatStore.getState();
  const { setChats } = useSelectChats.getState();
  const { currentUser } = useUserStore.getState();

  if (!chatId || !user || !currentUser) {
    console.error("❌ Missing chatId, user, or currentUser");
    return;
  }

  const currentUserId = currentUser?.userId;

  const senderRef = doc(db, "users", currentUserId);
  const receiverRef = doc(db, "users", user.userId);

  // ✅ Function to update user's chatList while preserving all other fields
  const updateChatList = async (userRef, targetUser) => {
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const chatList = userData.chatList || [];

    // Update only lastMessage & updatedAt while keeping other fields unchanged
    const updatedChatList = chatList.map((chat) =>
      chat.chatId === chatId
        ? {
            ...chat,
            lastMessage: text || "📷 Photo",
            updatedAt: new Date(),
          }
        : chat
    );

    // If chat does not exist, add a new entry
    if (!updatedChatList.find((chat) => chat.chatId === chatId)) {
      updatedChatList.push({
        chatId,
        lastMessage: text || "📷 Photo",
        receiverId: targetUser.userId,
        senderId: targetUser === currentUser ? user.userId : currentUserId,
        updatedAt: new Date(),
      });
    }

    await updateDoc(userRef, { chatList: updatedChatList });
  };

  // ✅ Update chat list for both sender and receiver
  await Promise.all([
    updateChatList(senderRef, user),
    updateChatList(receiverRef, currentUser),
  ]);
};
