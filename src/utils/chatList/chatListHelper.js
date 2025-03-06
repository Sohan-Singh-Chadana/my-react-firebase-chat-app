import { useSelectChats } from "../../store";

export const handleDeleteSelectedChat = (chat) => {
  const { selectedChats, addSelectedChat, removeSelectedChat } =
    useSelectChats.getState();

  if (selectedChats.some((c) => c.chatId === chat.chatId)) {
    removeSelectedChat(chat.chatId);
  } else {
    addSelectedChat(chat);
  }
};

// ✅ Fix `filteredChats` logic to handle `undefined` values
export const filteredChats = (searchInput) => {
  const { chats } = useSelectChats.getState();

  if (!Array.isArray(chats)) return [];

  const lowerCaseSearch = (searchInput || "").toLowerCase();
  return chats.filter((c) => {
    const userName = c?.user?.name?.toLowerCase() || "";
    return userName.includes(lowerCaseSearch);
  });
};
