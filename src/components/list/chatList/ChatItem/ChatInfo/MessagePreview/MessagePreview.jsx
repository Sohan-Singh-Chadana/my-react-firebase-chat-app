import { MdBlock, MdPhoto } from "react-icons/md";
import { getStatusIcon } from "../../../../../../utils/messages";

const MessagePreview = ({ lastMessage, currentUser }) => {
  // ✅ Get last message text
  const getLastMessageText = () => {
    const message = lastMessage;
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

  // ✅ Get status icon if the current user is the sender
  const getLastMessageStatusIcon = () => {
    const message = lastMessage;

    if (!message) return null;

    if (message?.senderId !== currentUser?.userId || !message?.status)
      return null;

    const StatusIcon = getStatusIcon(message.status);
    return StatusIcon ? <StatusIcon /> : null;
  };

  if (lastMessage?.isDeleted) {
    return (
      <>
        <MdBlock />
        <span>{getLastMessageText()}</span>
      </>
    );
  }

  if (lastMessage?.text) {
    return (
      <>
        {getLastMessageStatusIcon()}
        <span>{getLastMessageText()}</span>
      </>
    );
  }

  if (lastMessage?.img) {
    return (
      <>
        {getLastMessageStatusIcon()}
        <span>
          <MdPhoto style={{ marginRight: "0px" }} /> Photo
        </span>
      </>
    );
  }

  return null;
};

export default MessagePreview;
