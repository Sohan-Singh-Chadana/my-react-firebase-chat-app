import { MdBlock, MdPhoto } from "react-icons/md";
import { getStatusIcon, isEmojiOnly } from "../../../../../../utils/messages";

// ✅ Wrap emojis in span for larger font size
const formatEmojisInText = (text) => {
  const emojiRegex = /[\p{Emoji}]/gu;
  const numberRegex = /^[0-9\s+-.]+$/; // ✅ Detects only numbers and valid chars

  // ✅ Check if the text is only numbers or numeric characters
  const isOnlyNumbers = numberRegex.test(text.trim());

  // ✅ Handle numbers separately
  if (isOnlyNumbers) {
    return (
      <span key="number-text" className="normal-text">
        {text}
      </span>
    );
  }

  // ✅ Check for only emojis without any text or numbers
  const cleanedText = text.replace(/[0-9\s+-.]/g, "").trim();
  const onlyEmojis = cleanedText.replace(emojiRegex, "").trim().length === 0;

  if (onlyEmojis && cleanedText.length > 0) {
    // ✅ Render only emojis with no extra text
    return cleanedText.match(emojiRegex)?.map((emoji, index) => (
      <span key={`emoji-${index}`} className="large-emoji">
        {emoji}
      </span>
    ));
  }

  // ✅ Split text with emoji regex and get emoji parts
  const parts = text.split(emojiRegex);
  const emojis = text.match(emojiRegex) || [];

  return parts.flatMap((part, index) => [
    part && (
      <span key={`text-${index}`} className="normal-text">
        {part}
      </span>
    ),
    emojis[index] && (
      <span key={`emoji-${index}`} className="large-emoji">
        {emojis[index]}
      </span>
    ),
  ]);
};

const MessagePreview = ({ lastMessage, currentUser }) => {
  // ✅ Updated getLastMessageText to return JSX properly
  const getLastMessageText = () => {
    const message = lastMessage;
    const messageText = message?.text || "";

    const isDeletedMessage =
      message.senderId === currentUser.uid
        ? "You deleted this message"
        : "This message has been deleted";

    if (message?.isDeleted) {
      return (
        <span className="deleted" title={isDeletedMessage}>
          {isDeletedMessage}
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
        <span title={lastMessage?.text}>{getLastMessageText()}</span>
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
