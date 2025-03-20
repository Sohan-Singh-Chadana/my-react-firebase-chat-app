import { MdClose } from "react-icons/md";
import ChatInput from "../ChatInput";
import "./ImagePreviewPopup.css";
import SendButton from "../SendButton";

const ImagePreviewPopup = ({
  img,
  text,
  setText,
  onSend,
  onRemove,
  isCurrentUserBlocked,
  isReceiverBlocked,
}) => {
  const handleSendButtonClick = async () => {
    setText("");
    await onSend(); // ✅ Wait for message to be sent
  };

  return (
    <div className="image-preview">
      <div className="image-preview-container">
        <MdClose onClick={onRemove} className="close" />
        <div className="image">
          <img src={img.url} alt="" />
        </div>
        <ChatInput
          onSend={handleSendButtonClick}
          text={text}
          setText={setText}
          placeholder="Add a caption..."
        />
        <SendButton
          onClick={handleSendButtonClick}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
          hasContent={text || img.file}
          className="MediaSendBtn"
        />
      </div>
    </div>
  );
};

export default ImagePreviewPopup;
