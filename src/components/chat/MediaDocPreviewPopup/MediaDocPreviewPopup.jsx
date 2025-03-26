import { MdClose } from "react-icons/md";
import ChatInput from "../ChatInput";
import SendButton from "../SendButton";
import DocPreview from "./DocPreview";
import PdfFirstPagePreview from "./PdfFirstPagePreview";

import "./MediaDocPreviewPopup.css";

const MediaDocPreviewPopup = ({
  media,
  document,
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

  const renderPreview = () => {
    // ✅ Image Preview
    if (media.type?.startsWith("image")) {
      return (
        <div className="media">
          <img src={media.url} alt="Preview" className="media-preview" />
        </div>
      );
    }

    // ✅ Video Preview
    if (media.type?.startsWith("video")) {
      return (
        <div className="media">
          <video controls={false} className="media-preview" src={media.url} />
        </div>
      );
    }

    if (document?.file?.type === "application/pdf") {
      return <PdfFirstPagePreview file={document.file} />;
    }

    // ✅ Unsupported Types with Icon (DOC, XLS, ZIP, RAR, etc.)
    if (document.file) {
      return <DocPreview document={document} />;
    }

    // ❌ Unsupported Type
    return <p className="unsupported-preview">⚠️ Unsupported file type</p>;
  };

  return (
    <div className="image-preview">
      <div className="image-preview-container">
        {/* ✅ Close button to remove media/document */}
        <MdClose onClick={onRemove} className="close" />

        {/* ✅ Render media/document preview */}
        {renderPreview()}

        {/* ✅ Render ChatInput component */}
        <ChatInput
          onSend={handleSendButtonClick}
          text={text}
          setText={setText}
          placeholder="Add a caption..."
        />

        {/* ✅ Render SendButton component  */}
        <SendButton
          onClick={handleSendButtonClick}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
          hasContent={text || media.file || document.file}
          className="MediaSendBtn"
        />
      </div>
    </div>
  );
};

export default MediaDocPreviewPopup;
