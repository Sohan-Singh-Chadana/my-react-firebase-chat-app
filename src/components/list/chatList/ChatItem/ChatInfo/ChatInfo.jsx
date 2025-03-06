import { useLastMessageStore } from "../../../../../store";
import { formatTimestamp } from "../../../../../utils";
import { getStatusIcon } from "../../../../../utils/messages";
import "./ChatInfo.css";

const ChatInfo = ({ chat, currentUser }) => {
  const { lastMessageData } = useLastMessageStore();

  const lastMessageTime = formatTimestamp(chat.updatedAt?.seconds);

  const getLastMessage = () => {
    const message = chat.lastMessage || "";
    if (/[a-zA-Z]/.test(message)) {
      return message.length > 40 ? message.slice(0, 40) + "..." : message;
    }
    return message.split(/\s+/).length > 10
      ? message.split(/\s+/).slice(0, 15).join(" ") + "..."
      : message;
  };

  const getLastMessageStatusIcon = (chatId, lastMessageData, currentUser) => {
    const message = lastMessageData?.[chatId];

    if (!message || !message?.text) return null;

    if (message?.senderId !== currentUser?.userId || !message?.status)
      return null;

    const StatusIcon = getStatusIcon(message.status);
    return StatusIcon ? <StatusIcon /> : null;
  };

  const getChatUserName = (chat, currentUser) => {
    return chat.user?.blockedUsers?.includes(currentUser?.uid)
      ? "User"
      : chat.user?.name || "Unknown";
  };

  return (
    <div className="chat-info">
      <div className="chat-header">
        <h4>{getChatUserName(chat, currentUser)}</h4>
        <span className="time">{lastMessageTime}</span>
      </div>

      <p className="message-preview">
        {getLastMessageStatusIcon(chat.chatId, lastMessageData, currentUser)}
        <span>{getLastMessage()}</span>
      </p>

      {chat.unreadCount > 0 && (
        <span className="message-count">{chat.unreadCount}</span>
      )}
    </div>
  );
};

export default ChatInfo;
