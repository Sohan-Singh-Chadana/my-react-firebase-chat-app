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
  handleImagePreview,
  fileInputRef,
  handleSend,
  text,
  setText,
  img,
  setImg,
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
    setText("")

    await handleSend(); // ✅ Wait for message to be sent
  };

  const menuRef = useOutsideClick(
    () => setMenuOpen(false),
    menuOpen,
    ".mdOutlineAdd"
  );

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });

      // ✅ Reset file input to allow selecting the same file again
      e.target.value = "";
    }
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
              onImagePreview={handleImagePreview}
              menuRef={menuRef}
              menuOpen={menuOpen}
            />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImg}
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
            hasContent={(text || img.file) && !sendingMessage}
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
  handleImagePreview: PropTypes.func.isRequired,
  fileInputRef: PropTypes.object.isRequired,
  handleSend: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  setText: PropTypes.func.isRequired,
  img: PropTypes.shape({
    file: PropTypes.object,
    url: PropTypes.string,
  }).isRequired,
  setImg: PropTypes.func.isRequired,
};

export default memo(ChatFooter);
