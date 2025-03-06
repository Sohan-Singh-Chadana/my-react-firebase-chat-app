import { useMessageSelectionStore, useUserStore } from "../../../../store";
import { MdKeyboardArrowDown } from "react-icons/md";
import SelectableCheckbox from "./SelectableCheckbox";
import MessageTimestamp from "./MessageTimestamp";

const Message = ({ message }) => {
  const { currentUser } = useUserStore();
  const { showCheckboxes, selectMessage, selectedMessages } =
    useMessageSelectionStore();

  const isOwnMessage = message.senderId === currentUser.userId;
  const hasImage = message.img;
  const hasText = message.text;
  const hasImageAndText = hasImage && hasText;

  const getMessageContainerClass = () =>
    hasImageAndText ? "images" : hasImage ? "images" : "texts";

  const getMessageTextStyle = () => ({
    padding: hasText.length > 20 ? "8px 10px" : "0px",
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

  return (
    <div
      className={`messageBox ${
        selectedMessages.includes(message.id) ? "selected" : ""
      }`}
      onClick={handelSelectedMessages}
    >
      <SelectableCheckbox messageId={message.id} />
      <div className="messageContainer">
        <div className={isOwnMessage ? "message own" : "message"}>
          <span className="pointer"></span>
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

              {hasText && (
                <div className="message-text" style={getMessageTextStyle()}>
                  <pre>{hasText}</pre>
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

export default Message;
