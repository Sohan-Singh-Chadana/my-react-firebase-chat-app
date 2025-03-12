import {
  useChatStore,
  useLastMessageStore,
  useUnreadStore,
} from "../../../../../store";
import { formatTimestamp } from "../../../../../utils";
import "./ChatInfo.css";
import MessagePreview from "./MessagePreview";

const ChatInfo = ({ chat, currentUser }) => {
  const { lastMessageData } = useLastMessageStore();
  const { unreadCounts } = useUnreadStore();
  const { chatId } = useChatStore();

  const lastMessage = lastMessageData?.[chat.chatId];
  const lastMessageTime = formatTimestamp(lastMessage?.timestamp?.seconds);
  const firstTimeChatAddTime = formatTimestamp(chat.updatedAt?.seconds);

  // ✅ Get chat user name (handle blocked users)
  const getChatUserName = () => {
    return chat.user?.blockedUsers?.includes(currentUser?.uid)
      ? "User"
      : chat.user?.name || "Unknown";
  };

  // ✅ Determine the message preview class
  const getMessagePreviewClass = () => {
    const isDeleted = lastMessage?.isDeleted;
    return `message-preview ${isDeleted ? "deleted" : ""}`;
  };

  return (
    <div className="chat-info">
      <div className="chat-header">
        <h4>{getChatUserName(chat, currentUser)}</h4>
        <span className="time">{lastMessageTime || firstTimeChatAddTime}</span>
      </div>

      <p
        className={`${getMessagePreviewClass()} ${
          chat.lastMessage ? "" : "messagePadding"
        }`}
      >
        <MessagePreview lastMessage={lastMessage} currentUser={currentUser} />
      </p>

      {unreadCounts[chat.chatId] > 0 && chat.chatId !== chatId && (
        <span className="message-count">{unreadCounts[chat.chatId]}</span>
      )}
    </div>
  );
};

export default ChatInfo;
