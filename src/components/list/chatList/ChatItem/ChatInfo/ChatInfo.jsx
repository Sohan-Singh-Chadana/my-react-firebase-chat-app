import {
  useChatStore,
  useLastMessageStore,
  useUnreadStore,
} from "../../../../../store";
import { formatTimestamp } from "../../../../../utils";
import MessagePreview from "./MessagePreview";
import "./ChatInfo.css";

const ChatInfo = ({ chat, currentUser }) => {
  const { lastMessageData } = useLastMessageStore();
  const { unreadCounts } = useUnreadStore();
  const { chatId } = useChatStore();

  const lastMessage = lastMessageData?.[chat.chatId];
  const lastMessageTime = formatTimestamp(lastMessageData?.[chat.chatId]?.timestamp?.seconds);
  const firstTimeChatAddTime = formatTimestamp(chat.updatedAt?.seconds);

  // ✅ Get chat user name (handle blocked users)
  const getChatUserName = () => {
    return chat.user?.blockedUsers?.includes(currentUser?.uid)
      ? "User"
      : chat.user?.name || "Unknown";
  };

  // ✅ Determine the message preview class
  const getMessagePreviewClass = () => {
    return `message-preview`;
  };

  const userNameText = getChatUserName(chat, currentUser);

  console.log(lastMessage)

  return (
    <div className="chat-info">
      <div className="chat-header">
        <h4 title={userNameText}>{userNameText}</h4>
        <span className="time">{lastMessageTime || firstTimeChatAddTime}</span>
      </div>

      <p
        className={`${getMessagePreviewClass()} ${
          lastMessageData?.[chat.chatId] ? "" : "noLastMsg"
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
