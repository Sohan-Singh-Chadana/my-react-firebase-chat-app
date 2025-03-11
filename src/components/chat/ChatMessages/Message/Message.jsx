import { useMessageSelectionStore, useUserStore } from "../../../../store";
import { MdBlock, MdKeyboardArrowDown } from "react-icons/md";
import SelectableCheckbox from "./SelectableCheckbox";
import MessageTimestamp from "./MessageTimestamp";

const Message = ({ message, index, messages }) => {
  const { currentUser } = useUserStore();
  const { showCheckboxes, selectMessage, selectedMessages } =
    useMessageSelectionStore();

  const isOwnMessage = message.senderId === currentUser.userId;
  const hasImage = message.img;
  const hasText = message.text;
  const hasImageAndText = hasImage && hasText;

  const renderedText = renderMessage(message, currentUser);
  const hasMessageText = renderedText;
  const isDeletedMessage = message.isDeleted;

  const getMessageContainerClass = () =>
    hasImageAndText ? "images" : hasImage ? "images" : "texts";

  const getMessageTextStyle = () => ({
    padding: hasText.split(" ").length >= 25 ? "4px 4px" : "0px",
  });

  const getMessageImageClass = () =>
    `image-box ${!hasText ? "with-gradient" : ""}`;

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
              {hasImage && (
                <div className={getMessageImageClass()}>
                  <img src={hasImage} alt="" />
                </div>
              )}

              {hasMessageText && (
                <div
                  className={`message-text ${
                    isDeletedMessage ? "deleteText" : ""
                  }`}
                  style={getMessageTextStyle()}
                >
                  <pre>
                    {isDeletedMessage && <MdBlock />} {hasMessageText}
                  </pre>
                </div>
              )}

              {/* Timestamp & Status */}
              <MessageTimestamp message={message} isOwnMessage={isOwnMessage} />
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
