import { MdBlock, MdPhoto } from "react-icons/md";
import { getStatusIcon, isEmojiOnly } from "../../../../../../utils/messages";

// ✅ Wrap emojis in span for larger font size
const formatEmojisInText = (text) => {
  const emojiRegex = /[\p{Emoji}]/gu;
  const parts = text.split(emojiRegex);
  const emojis = text.match(emojiRegex) || [];

  return parts.flatMap((part, index) => [
    <span key={`text-${index}`} className="normal-text">
      {part}
    </span>,

    emojis[index] && (
      <span key={`emoji-${index}`} className="large-emoji">
        {emojis[index]}
      </span>
    ),
  ]);
};

const MessagePreview = ({ lastMessage, currentUser }) => {
  // ✅ Get last message text
  // const getLastMessageText = () => {
  //   const message = lastMessage;
  //   const messageText = message?.text || "";

  //   if (message?.isDeleted) {
  //     return message.senderId === currentUser.uid
  //       ? "You deleted this message"
  //       : "This message has been deleted";
  //   }

  //   // ✅ Handle emoji-only messages
  //   if (isEmojiOnly(messageText)) {
  //     return (
  //       <span className="emoji-only-text">
  //         {formatEmojisInText(messageText)}
  //       </span>
  //     );
  //   }

  //   // ✅ Check for Hindi characters (Devanagari script)
  //   const isHindiText = /[\u0900-\u097F]/.test(messageText); // Devanagari Unicode range

  //   // ✅ Check for English letters
  //   const isEnglishText = /[a-zA-Z]/.test(messageText);

  //   // ✅ Handle text length based on language
  //   if (isHindiText) {
  //     return messageText.length > 45
  //       ? messageText.slice(0, 45) + "..."
  //       : messageText;
  //   }

  //   if (isEnglishText) {
  //     return messageText.length > 40
  //       ? messageText.slice(0, 40) + "..."
  //       : messageText;
  //   }

  //   // ✅ Fallback for space-separated words (Hindi, emojis, etc.)
  //   return messageText.split(/\s+/).length > 10
  //     ? messageText.split(/\s+/).slice(0, 10).join(" ") + "..."
  //     : messageText; // 👍
  // };

  // ✅ Updated getLastMessageText to return JSX properly
  const getLastMessageText = () => {
    const message = lastMessage;
    const messageText = message?.text || "";

    if (message?.isDeleted) {
      return (
        <span className="deleted">
          {message.senderId === currentUser.uid
            ? "You deleted this message"
            : "This message has been deleted"}
        </span>
      );
    }

    // ✅ Handle emoji-only messages properly
    if (isEmojiOnly(messageText)) {
      return (
        <span className="emoji-only-text">
          {formatEmojisInText(messageText)}
        </span>
      );
    }

    // ✅ Check for Hindi characters (Devanagari script)
    const isHindiText = /[\u0900-\u097F]/.test(messageText); // Devanagari Unicode range

    // ✅ Check for English letters
    const isEnglishText = /[a-zA-Z]/.test(messageText);

    // ✅ Handle text length based on language
    if (isHindiText || isEnglishText) {
      const truncatedText =
        messageText.length > (isHindiText ? 45 : 40)
          ? messageText.slice(0, isHindiText ? 45 : 40) + "..."
          : messageText;
      return formatEmojisInText(truncatedText);
    }

    // ✅ Handle space-separated words (fallback for mixed content)
    const words = messageText.split(/\s+/);
    const truncatedText =
      words.length > 10 ? words.slice(0, 10).join(" ") + "..." : messageText;

    return formatEmojisInText(truncatedText);
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
        {getLastMessageText()}
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
