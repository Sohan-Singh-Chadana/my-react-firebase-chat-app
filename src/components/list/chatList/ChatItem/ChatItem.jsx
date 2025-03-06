import {
  useChatStore,
  useGlobalStateStore,
  useSelectChats,
  useUserStore,
} from "../../../../store";
import {
  handleChatSelect,
  handleDeleteSelectedChat,
} from "../../../../utils/chatList";

import Avatar from "./Avatar";
import ChatInfo from "./ChatInfo";
import "./ChatItem.css";

const ChatItem = ({ chat }) => {
  const { chatId } = useChatStore();
  const { selectMode } = useGlobalStateStore();
  const { selectedChats } = useSelectChats();
  const { currentUser } = useUserStore();

  // ✅ Function for cleaner class handling
  const getChatItemClass = () => {
    let classes = "chat-item";
    if (chatId === chat.chatId) classes += " selected";
    if (selectMode) classes += " with-checkbox";
    if (chat.unreadCount > 0) classes += " unread";
    return classes;
  };
  return (
    <div
      onClick={(event) => handleChatSelect(chat, event)}
      className={getChatItemClass()}
    >
      {selectMode && (
        <input
          type="checkbox"
          className="custom-checkbox"
          checked={selectedChats.some((c) => c.chatId === chat.chatId)}
          onChange={(e) => {
            e.stopPropagation();
            handleDeleteSelectedChat(chat);
          }}
        />
      )}

      <div className="chat-content">
        <Avatar chat={chat} currentUser={currentUser} />
        <ChatInfo
          chat={chat}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
};

export default ChatItem;
