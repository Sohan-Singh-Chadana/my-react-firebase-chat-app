import { memo, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useMessageSelectionStore, useUserStore } from "../../../../store";
import { isEmojiOnly } from "../../../../utils/messages";
import SelectableCheckbox from "./SelectableCheckbox";
import MessageTimestamp from "./MessageTimestamp";
import MessageImage from "./MessageImage";
import MessageText from "./MessageText";
import BlurredImagePreview from "./BlurredImagePreview";
import MessageDocument from "./MessageDocument";
import "./Message.css";

const Message = ({ message, index, messages }) => {
  const { currentUser } = useUserStore();
  const { showCheckboxes, selectMessage, selectedMessages } =
    useMessageSelectionStore();

  const isOwnMessage = message.senderId === currentUser.userId;
  const hasMedia = Boolean(message.media);
  const hasText = Boolean(message.text);
  const hasDoc = Boolean(message.docUrl);
  const hasImageAndText = hasMedia && hasText;

  const [mediaLoading, setMediaLoading] = useState(
    message?.media ? true : false
  );
  const [imageError, setImageError] = useState(false);

  // ✅ isSending flag Firebase se use karo
  const isSending = message.isSending || false;

  const renderedText = renderMessage(message, currentUser);
  const isDeletedMessage = Boolean(message.isDeleted);
  const onlyEmojis = isEmojiOnly(renderedText);

  // ✅ Updated to handle emoji-only messages
  const getMessageContainerClass = () => {
    if (hasImageAndText) return "image-container";
    if (hasMedia) return "image-container";
    if (onlyEmojis) return "emoji-container"; // ✅ Special class for emoji-only
    if (hasDoc) return "document-container";
    return "texts-container";
  };

  const handleImageLoad = () => {
    setMediaLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setMediaLoading(false);
    setImageError(true);
  };

  const handelSelectedMessages = (e) => {
    e.stopPropagation();

    if (e.target.closest(".message")) {
      return;
    }

    if (showCheckboxes) {
      selectMessage(message.id);
    }
  };

  const previousMessage = messages[index - 1];
  const isFirstMessageOfSender =
    !previousMessage ||
    previousMessage?.senderId !== message?.senderId ||
    previousMessage?.formattedDate !== message?.formattedDate;

  return (
    <div
      className={`messageBox ${
        selectedMessages.includes(message.id) ? "selected" : ""
      }`}
      data-index={index}
      onClick={handelSelectedMessages}
    >
      <SelectableCheckbox messageId={message.id} />
      <div className="messageContainer">
        <div
          className={`text-selection-allow ${
            isOwnMessage ? "message own" : "message"
          } ${onlyEmojis ? "emoji-only" : ""} `}
        >
          {isFirstMessageOfSender && <span className="pointer"></span>}

          <div className="message-content">
            <div className="down-icon">
              <MdKeyboardArrowDown />
            </div>

            <div className={getMessageContainerClass()}>
              {/* ✅ Show Blurred Preview while Image is Uploading */}
              {isSending && hasMedia && isOwnMessage && (
                <BlurredImagePreview
                  mediaSrc={message.media}
                  mediaType={message.mediaType}
                />
              )}

              {/* ✅ Jab image upload ho jaye (isSending false ho), tab image show ho */}
              {!isSending && hasMedia && (
                <MessageImage
                  mediaLoading={mediaLoading}
                  imageError={imageError}
                  hasText={hasText}
                  src={message.media}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  message={message}
                />
              )}

              {hasDoc && (
                <MessageDocument
                  message={message}
                  isOwnMessage={isOwnMessage}
                />
              )}

              {/* ✅ Render Message Text */}
              {renderedText && (
                <MessageText
                  hasText={message.text}
                  hasImageAndText={hasImageAndText}
                  hasDoc={message.docUrl}
                  text={renderedText}
                  isDeleted={isDeletedMessage}
                />
              )}

              {/* ✅ Timestamp & Status &  Emoji */}
              {(!mediaLoading || isSending) && (
                <MessageTimestamp
                  message={message}
                  isOwnMessage={isOwnMessage}
                  className={`${
                    hasText
                      ? "messageTimeStamp"
                      : message.docName
                      ? "messageTimeStamp docMessageTimeStamp"
                      : "imgMessageTimeStamp"
                  } ${onlyEmojis ? "emoji-timestamp" : ""}`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Function to handle deleted messages
const renderMessage = (message, currentUser) => {
  if (message.isDeleted) {
    return message.senderId === currentUser.uid
      ? "You deleted this message"
      : "This message has been deleted";
  }
  return message.text;
};

export default memo(Message);
