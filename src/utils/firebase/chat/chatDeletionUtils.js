import { useGlobalStateStore, useSelectChats } from "../../../store";
import { deleteChatHandler } from "./deleteChatHandler";

export const chatDeletionUtils = async () => {
  const { setSelectMode } = useGlobalStateStore.getState();
  const { selectedChats, clearSelectedChats } = useSelectChats.getState();

  if (!Array.isArray(selectedChats) || selectedChats.length === 0) return;

  const chatIds = selectedChats.map((chat) => chat.chatId);

  if (chatIds.length === 0) return;

  try {
    await deleteChatHandler(chatIds);
    clearSelectedChats();
    setSelectMode(false);
  } catch (error) {
    console.error("❌ [Error] Failed to delete chats:", error);
  }
};
