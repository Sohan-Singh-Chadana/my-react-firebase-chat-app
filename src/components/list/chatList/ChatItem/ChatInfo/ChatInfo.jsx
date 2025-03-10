import {
  useChatStore,
  useLastMessageStore,
  useUnreadStore,
} from "../../../../../store";
import { formatTimestamp } from "../../../../../utils";
import { getStatusIcon } from "../../../../../utils/messages";
import "./ChatInfo.css";

const ChatInfo = ({ chat, currentUser }) => {
  const { lastMessageData } = useLastMessageStore();
  const { unreadCounts } = useUnreadStore(); // Zustand से unreadCounts ले रहे हैं
  const { chatId } = useChatStore();

  // const lastMessageTime = formatTimestamp(chat.updatedAt?.seconds);
  const lastMessageTime = formatTimestamp(
    lastMessageData?.[chat.chatId]?.timestamp?.seconds
  );
  const firstTimeChatAddTime = formatTimestamp(chat.updatedAt?.seconds);

  const getLastMessage = (chatId) => {
    // const message = chat.lastMessage || "";
    const message = lastMessageData?.[chatId]?.text || "";
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
        <span className="time">{lastMessageTime || firstTimeChatAddTime}</span>
      </div>

      <p
        className="message-preview"
        style={{ padding: chat.lastMessage ? "0px" : "8px 0px" }}
      >
        {getLastMessage(chat.chatId) &&
          getLastMessageStatusIcon(chat.chatId, lastMessageData, currentUser)}
        <span>{getLastMessage(chat.chatId)}</span>
      </p>

      {/* {chat.unreadCount > 0 && (
        <span className="message-count">{chat.unreadCount}</span>
      )} */}
      {unreadCounts[chat.chatId] > 0 && chat.chatId !== chatId && (
        <span className="message-count">{unreadCounts[chat.chatId]}</span>
      )}
    </div>
  );
};

export default ChatInfo;
