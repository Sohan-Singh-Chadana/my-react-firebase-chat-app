import { useEffect, useState } from "react";
import { MdBlock } from "react-icons/md";
import {
  detectMessageType,
  formatMixedText,
} from "../../../../../utils/messages";
import "./MessageText.css";

const MessageText = ({ hasText, hasDoc, hasImageAndText, text, isDeleted }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messageType, setMessageType] = useState("english");
  const maxTextLength = 800;

  // ✅ Detect message type on initial render
  useEffect(() => {
    setMessageType(detectMessageType(text));
  }, [text]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const shouldTruncate = text.length > maxTextLength;

  const getMessageTextClass = () => {
    let classes = "";

    const wordCount = hasText.split(" ").length;
    const textLength = hasText.length;

    // ✅ Check for Hindi characters (Devanagari script)
    const isHindiText = /[\u0900-\u097F]/.test(hasText);

    // ✅ Detect numbers correctly now
    const numberRegex = /^\+?[0-9\s-]+$/; // ✅ Check for numbers, including +, -
    const hasNumbers = numberRegex.test(hasText.trim());

    // ✅ Emoji detection with proper count
    const emojiRegex = /\p{Extended_Pictographic}/gu;
    const emojis = hasText.match(emojiRegex) || [];

    const longTextLimit = isHindiText ? 180 : 120; // Higher limit for Hindi
    const mediumTextLimit = isHindiText ? 100 : 60; // Higher limit for Hindi

    // ✅ Check for long text if word count >= 25 or text length > threshold
    if (wordCount >= 25 || textLength > longTextLimit) {
      classes += "long-text bold-text ";
    }
    // ✅ Check for medium-long text if word count >= 12 or text length > threshold
    else if (wordCount >= 12 || textLength > mediumTextLimit) {
      classes += "medium-long-text bold-text ";
    }

    if (hasImageAndText) {
      classes += "image-text ";
    }

    if (hasDoc) {
      classes += "doc-text ";
    }

    // ✅ Add class based on detected message type
    if (messageType === "emoji") {
      if (emojis.length === 1) {
        classes += " single-emoji";
      } else if (emojis.length > 1) {
        classes += " multi-emoji-text";
      }
    } else if (messageType === "hindi") {
      classes += " hindi-text";
    } else if (messageType === "mixed") {
      classes += " mixed-text";
    }

    // ✅ Treat numbers like normal text (default to message-text class)
    else if (hasNumbers) {
      classes += "number-text"; // ✅ Treat numbers as normal text
    }

    return classes.trim();
  };

  return (
    <div
      className={`message-text ${
        isDeleted ? "deleteText" : ""
      } ${getMessageTextClass()}`}
    >
      <pre>
        {isDeleted && <MdBlock className="deleted-icon" />}
        {isExpanded || !shouldTruncate ? (
          messageType === "mixed" || messageType === "mixed-number" ? (
            formatMixedText(text)
          ) : (
            <span>{text}</span>
          )
        ) : messageType === "mixed" || messageType === "mixed-number" ? (
          formatMixedText(`${text.slice(0, maxTextLength)} ...`)
        ) : text.length >= 25 ? (
          <span>{text.slice(0, maxTextLength)} ...</span>
        ) : (
          `${text.slice(0, maxTextLength)} ...`
        )}
        {/* ✅ Show "Read More" or "Read Less" */}
        {shouldTruncate && !isExpanded && (
          <button className="read-more-btn" onClick={toggleExpand}>
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        )}
      </pre>
    </div>
  );
};

export default MessageText;
