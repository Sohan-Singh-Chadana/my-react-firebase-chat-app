import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase/firebase";
import { useChatStore, useSelectChats, useUserStore } from "../../store";
import { resetUnreadCount } from "../unreadMessagesUtils";

export const handleChatSelect = async (chat, event) => {
  const { chats, setChats } = useSelectChats.getState();
  const { currentUser } = useUserStore.getState();
  const { chatId, changeChat, resetChatId } = useChatStore.getState();

  if (event?.target?.type === "checkbox") return;

  if (!chat?.chatId || !chat?.user)
    return console.error("Invalid chat object:", chat);

  if (!chats || !Array.isArray(chats))
    return console.error("Chats state is invalid:", chats);

  if (chatId === chat.chatId) {
    resetChatId();
    await resetUnreadCount(chat.chatId, currentUser?.uid);
    return;
  }

  const updatedChats = chats.map((item) =>
    item.chatId === chat.chatId ? { ...item, unreadCount: 0 } : item
  );
  setChats(updatedChats);

  try {
    const userRef = doc(db, "users", currentUser?.uid);

    if (!currentUser?.uid) {
      console.error("Invalid currentUser:", currentUser);
      return;
    }

    const chatListToUpdate = updatedChats.map((chat) => {
      const chatCopy = { ...chat };

      delete chatCopy.user;
      delete chatCopy.isSeen;
      delete chatCopy.lastMessageData;
      delete chatCopy.unreadCount;

      return chatCopy;
    });

    await updateDoc(userRef, { chatList: chatListToUpdate });
    changeChat(chat.chatId, chat.user);
  } catch (error) {
    console.error("Error updating Firestore:", error);
  }
};
