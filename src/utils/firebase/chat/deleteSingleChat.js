import { useChatStore } from "../../../store";
import { deleteChatHandler } from "./deleteChatHandler";

export const deleteSingleChat = async () => {
  const { chatId } = useChatStore.getState();

  if (!chatId) return;

  try {
    await deleteChatHandler([chatId]);
  } catch (error) {
    console.error("❌ [Error] Failed to delete chat:", error);
  }
};
