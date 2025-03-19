import { useEffect, useState } from "react";
import { MdBlock } from "react-icons/md";
import {
  detectMessageType,
  formatMixedText,
} from "../../../../../utils/messages";
import "./MessageText.css";

const MessageText = ({ hasText, hasImageAndText, text, isDeleted }) => {
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

    if (hasText.split(" ").length >= 25) {
      classes += "long-text ";
    }

    if(hasText.split(" ").length >= 10) {
      classes += "medium-long-text ";
    }

    if (hasImageAndText) {
      classes += "image-text ";
    }

    // ✅ Add class based on detected message type
    if (messageType === "emoji") {
      classes += " emoji-text";
    } else if (messageType === "hindi") {
      classes += " hindi-text";
    } else if (messageType === "mixed") {
      classes += " mixed-text";
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
          ) : text.length >= 25 ? (
            <span className="bold-text">{text}</span>
          ) : (
            <span>{text}</span>
          )
        ) : messageType === "mixed" || messageType === "mixed-number" ? (
          formatMixedText(`${text.slice(0, maxTextLength)}...`)
        ) : text.length >= 25 ? (
          <span className="bold-text">{text.slice(0, maxTextLength)}...</span>
        ) : (
          `${text.slice(0, maxTextLength)}...`
        )}{" "}
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
