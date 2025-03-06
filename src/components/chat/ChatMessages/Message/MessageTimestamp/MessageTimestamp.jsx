import { getStatusIcon } from "../../../../../utils/messages";
import { formatMessageTime } from "../../../../../utils";
import "./MessageTimestamp.css";

const MessageTimestamp = ({ message, isOwnMessage }) => {
  const hasImage = message.img;
  const hasText = message.text;
  const hasImageAndText = hasImage && hasText;
  const time = formatMessageTime(message.timestamp)
  const StatusIcon = isOwnMessage ? getStatusIcon(message.status) : null;
  const isLongText = hasText && message.text.split(" ").length > 10;

  const getMessageColor = () =>
    hasImageAndText
      ? "var(--text-secondary)"
      : hasImage
      ? "white"
      : "var(--text-secondary)";

  const getTimePositionStyle = () => ({
    paddingRight: isLongText ? "10px" : "0%",
    position: isLongText ? "absolute" : "unset",
    bottom: isLongText ? "8px" : "0%",
    right: isLongText ? "1px" : "0%",
  });

  const getTimestampClass = () =>
    hasImageAndText ? "imgSpan" : hasImage ? "imgSpan" : "textSpan";

  return (
    <span
      className={getTimestampClass()}
      style={{
        color: getMessageColor(),
        ...getTimePositionStyle(),
      }}
    >
      {time}
      {StatusIcon && <StatusIcon />}
    </span>
  );
};

export default MessageTimestamp;
