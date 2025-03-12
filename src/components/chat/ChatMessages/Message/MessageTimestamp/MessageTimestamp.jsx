import { getStatusIcon } from "../../../../../utils/messages";
import { formatMessageTime } from "../../../../../utils";
import "./MessageTimestamp.css";

const MessageTimestamp = ({ message, isOwnMessage, className }) => {
  const hasImage = message.img;
  const hasText = message.text;
  const hasImageAndText = hasImage && hasText;
  const time = formatMessageTime(message.timestamp);
  const StatusIcon =
    isOwnMessage && !message.isDeleted ? getStatusIcon(message.status) : null;
  const isLongText = hasText && message.text.split(" ").length > 10;

  return (
    <span
      className={
        isLongText
          ? `${className} isLogTextTimeStamp`
          : hasImageAndText
          ? `${className} imageWithTextTimeStamp`
          : className
      }
    >
      {time}
      {StatusIcon && <StatusIcon />}
    </span>
  );
};

export default MessageTimestamp;
