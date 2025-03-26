import { memo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { MdOutlineAdd } from "react-icons/md";
import PopupMenu from "../PopupMenu";
import ChatInput from "../ChatInput";
import SendButton from "../SendButton";
import { useChatStore } from "../../../store";
import { useOutsideClick } from "../../../hooks";
import "./ChatFooter.css";

const ChatFooter = ({
  handleMediaPreview,
  handleDocumentPreview,
  fileInputMediaRef,
  fileInputDocumentRef,
  handleSend,
  text,
  setText,
  media,
  setMedia,
  document,
  setDocument,
  sendingMessage,
}) => {
  const { user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const textareaRef = useRef(null);

  const handleButtonClick = async () => {
    // ✅ Now reset textarea height after message is sent
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setText("");

    await handleSend(); // ✅ Wait for message to be sent
  };

  const menuRef = useOutsideClick(
    () => setMenuOpen(false),
    menuOpen,
    ".mdOutlineAdd"
  );

  const handleMediaChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // ✅ Allowed File Types: Images + Videos
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/quicktime", // .mov
      "video/x-msvideo", // .avi
    ];

    if (file && allowedTypes.includes(file.type)) {
      const fileType = file.type.split("/")[0];

      setMedia({
        file,
        url: URL.createObjectURL(file),
        type: fileType,
      });

      // console.log(`✅ ${fileType} selected: ${file.name}`);
    } else {
      alert("❌ Invalid file type! Only images and videos are allowed.");
    }

    // ✅ Reset file input to allow selecting the same file again
    e.target.value = "";
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Get file extension safely
    // const fileExtension = file.name.split(".").pop().toLowerCase();

    // ✅ Create a preview URL for all file types
    setDocument({
      file,
      url: URL.createObjectURL(file), // ✅ Create URL for preview/download
      name: file.name,
    });

    // ✅ Reset file input to allow selecting the same file again
    e.target.value = "";
  };

  return (
    <div className="bottom">
      {!(isCurrentUserBlocked || isReceiverBlocked) ? (
        <>
          <div className="icons">
            <MdOutlineAdd
              className={`mdOutlineAdd ${menuOpen ? "active" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
            />

            <PopupMenu
              onMediaPreview={handleMediaPreview}
              onDocumentPreview={handleDocumentPreview}
              menuRef={menuRef}
              menuOpen={menuOpen}
            />
          </div>

          <input
            type="file"
            ref={fileInputMediaRef}
            style={{ display: "none" }}
            onChange={handleMediaChange}
            accept="image/*,video/*"
          />

          <input
            type="file"
            ref={fileInputDocumentRef}
            accept="*" // ✅ Allow all file types
            onChange={handleDocumentChange}
            style={{ display: "none" }}
          />

          <ChatInput
            onSend={handleButtonClick}
            text={text}
            setText={setText}
            textareaRef={textareaRef}
          />
          <SendButton
            onClick={handleButtonClick}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
            hasContent={
              (text || media.file || document.file) && !sendingMessage
            }
            className="sendButton"
          />
        </>
      ) : (
        <p className="block-text">
          Can&apos;t send a message to blocked user {user?.username}.
        </p>
      )}
    </div>
  );
};

// Props validation
ChatFooter.propTypes = {
  handleMediaPreview: PropTypes.func.isRequired,
  handleDocumentPreview: PropTypes.func.isRequired,
  fileInputMediaRef: PropTypes.object.isRequired,
  fileInputDocumentRef: PropTypes.object.isRequired,
  handleSend: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  setText: PropTypes.func.isRequired,
  media: PropTypes.shape({
    file: PropTypes.object,
    url: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  setMedia: PropTypes.func.isRequired,
  document: PropTypes.shape({
    file: PropTypes.object,
    url: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  setDocument: PropTypes.func.isRequired,
};

export default memo(ChatFooter);
