import { useState } from "react";
import {
  useMessageSelectionStore,
  useMessagesStore,
  useUserStore,
} from "../../../../store";
import { MdKeyboardArrowDown } from "react-icons/md";
import SelectableCheckbox from "./SelectableCheckbox";
import MessageTimestamp from "./MessageTimestamp";
import MessageImage from "./MessageImage";
import MessageText from "./MessageText";
import { useMessageSender } from "../../../../hooks";
import "./Message.css";
import MessageImageLoader from "./MessageImage/MessageImageLoader";

const Message = ({ message, index, messages }) => {
  const { currentUser } = useUserStore();
  const { showCheckboxes, selectMessage, selectedMessages } =
    useMessageSelectionStore();
  const { img } = useMessageSender();

  // const isLoading = useMessagesStore((state) => state.isLoading);

  const isOwnMessage = message.senderId === currentUser.userId;
  const hasImage = Boolean(message.img);
  const hasText = Boolean(message.text);
  const hasImageAndText = hasImage && hasText;

  const [imageLoading, setImageLoading] = useState(message?.img ? true : false);
  const [imageError, setImageError] = useState(false);

  // ✅ isSending flag Firebase se use karo
  const isSending = message.isSending || false;

  const renderedText = renderMessage(message, currentUser);
  const isDeletedMessage = Boolean(message.isDeleted);

  const getMessageContainerClass = () =>
    hasImageAndText
      ? "image-container"
      : hasImage
      ? "image-container"
      : "texts-container";

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
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
        <div className={isOwnMessage ? "message own" : "message"}>
          {isFirstMessageOfSender && <span className="pointer"></span>}

          <div className="message-content">
            <div className="down-icon">
              <MdKeyboardArrowDown />
            </div>

            <div className={getMessageContainerClass()}>
              {/* ✅ Spinner jab tak image send ho rahi hai */}
              {isSending && <MessageImageLoader />}

              {/* ✅ Jab image upload ho jaye (isSending false ho), tab image show ho */}
              {!isSending && hasImage && (
                <MessageImage
                  imageLoading={imageLoading}
                  imageError={imageError}
                  hasText={hasText}
                  src={message.img}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              )}

              {renderedText && (
                <MessageText
                  hasText={message.text}
                  hasImageAndText={hasImageAndText}
                  text={renderedText}
                  isDeleted={isDeletedMessage}
                />
              )}

              {/* Timestamp & Status */}
              {!imageLoading && (
                <MessageTimestamp
                  message={message}
                  isOwnMessage={isOwnMessage}
                  className={
                    hasText ? "messageTimeStamp" : "imgMessageTimeStamp"
                  }
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

export default Message;
