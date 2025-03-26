import { MdBlock } from "react-icons/md";
import { getStatusIcon, isEmojiOnly } from "../../../../../../utils/messages";
import { FaCamera, FaFileAlt, FaVideo } from "react-icons/fa";

// ✅ Wrap emojis in span for larger font size
const formatEmojisInText = (text) => {
  const emojiRegex = /\p{Extended_Pictographic}/gu; // ✅ Emojis only
  const numberRegex = /^[0-9\s+-.]+$/; // ✅ Pure number strings only
  const mixedNumberRegex = /[0-9]+/g; // ✅ Detect numbers anywhere in the text

  // ✅ Check if the whole text is only numbers (pure numeric string)
  if (numberRegex.test(text.trim())) {
    return (
      <span key="number-text" className="number-text">
        {text}
      </span>
    );
  }

  // ✅ Split text properly into parts (numbers, emojis, and text)
  const parts = splitWithEmojisAndMixedNumbers(text);

  // ✅ Correctly map through parts and apply respective classes
  return parts.map((part, index) => {
    if (emojiRegex.test(part)) {
      // 🎉 Emoji part
      return (
        <span key={`emoji-${index}`} className="large-emoji">
          {part}
        </span>
      );
    } else if (mixedNumberRegex.test(part.trim()) && !isNaN(part.trim())) {
      // 🔢 Properly handle numeric part (number-text)
      return (
        <span key={`number-${index}`} className="number-text">
          {part}
        </span>
      );
    } else {
      // 📚 Normal text part
      return (
        <span key={`text-${index}`} className="normal-text">
          {part}
        </span>
      );
    }
  });
};

// ✅ Enhanced splitting function that handles text, numbers, and emojis properly
const splitWithEmojisAndMixedNumbers = (text) => {
  const regex = /(\p{Extended_Pictographic}+|[0-9]+(?:\.\d+)?|[^\p{Extended_Pictographic}0-9]+)/gu;
  return text.match(regex) || [];
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

    // ✅ Handle document or  attachments
    if (message?.docName) {
      const truncatedDocName =
        message.docName.length > 40
          ? message.docName.slice(0, 40) + "..."
          : message.docName;

      return (
        <>
          <FaFileAlt style={{ marginRight: "0px" }} />
          <span className="attachment-text" title={message.docName}>
            {truncatedDocName}
          </span>
        </>
      );
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

  if (lastMessage?.docUrl) {
    return (
      <>
        {getLastMessageStatusIcon()}
        {getLastMessageText()}
      </>
    );
  }

  if (lastMessage?.media) {
    return (
      <>
        {getLastMessageStatusIcon()}
        {lastMessage.mediaType === "image" ? (
          <span title="Photo">
            <FaCamera style={{ marginRight: "0px" }} /> Photo
          </span>
        ) : lastMessage.mediaType === "video" ? (
          <span title="Video">
            <FaVideo style={{ marginRight: "0px" }} /> Video
          </span>
        ) : null}
      </>
    );
  }

  return null;
};

export default MessagePreview;
