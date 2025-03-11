import { MdBlock } from "react-icons/md";
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

  // ✅ Function to handle deleted messages
  const getLastMessage = (chatId) => {
    const message = lastMessageData?.[chatId];
    const messageText = message?.text || "";

    if (message?.isDeleted) {
      return message.senderId === currentUser.uid
        ? "You deleted this message"
        : "This message has been deleted";
    }

    if (/[a-zA-Z]/.test(messageText)) {
      return messageText.length > 40
        ? messageText.slice(0, 40) + "..."
        : messageText;
    }

    return messageText.split(/\s+/).length > 10
      ? messageText.split(/\s+/).slice(0, 10).join(" ") + "..."
      : messageText; // 👍
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

  const getMessagePreviewClass = (chatId) => {
    const isDeleted = lastMessageData?.[chatId]?.isDeleted;
    return `message-preview ${isDeleted ? "deleted" : ""}`;
  };

  return (
    <div className="chat-info">
      <div className="chat-header">
        <h4>{getChatUserName(chat, currentUser)}</h4>
        <span className="time">{lastMessageTime || firstTimeChatAddTime}</span>
      </div>

      <p
        className={getMessagePreviewClass(chat.chatId)}
        style={{ padding: chat.lastMessage ? "0px" : "8px 0px" }}
      >
        {getLastMessage(chat.chatId) &&
        lastMessageData?.[chat.chatId]?.isDeleted ? (
          <MdBlock />
        ) : (
          getLastMessageStatusIcon(chat.chatId, lastMessageData, currentUser)
        )}
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
