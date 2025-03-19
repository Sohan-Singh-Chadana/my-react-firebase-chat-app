import { useState, useRef } from "react";
import { MdEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import { isEmojiOnly } from "../../../utils/messages";
import { useOutsideClick } from "../../../hooks";
import "./ChatInput.css";

const ChatInput = ({ onSend, text, setText, placeholder = "" }) => {
  //   const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  // const emojiRef = useRef(null);
  const textareaRef = useRef(null);
  const onlyEmojis = isEmojiOnly(text);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji); // Emoji ko text ke sath add karein
  };

  const toggleEmojiPicker = () => {
    setOpen((prev) => !prev);
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(text);
      setText("");

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const emojiRef = useOutsideClick(() => setOpen(false), open, ".emoji");

  return (
    <div className="input-box">
      <div className="emoji" ref={emojiRef}>
        <MdEmojiEmotions onClick={toggleEmojiPicker} />
        {open && (
          <div className="picker">
            <EmojiPicker
              open={open}
              onEmojiClick={handleEmoji}
              style={{
                width: "500px",
                backgroundColor: "var(--emoji-bg-color)",
                borderColor: "var(--emoji-bg-color)",
              }}
            />
          </div>
        )}
      </div>
      <textarea
        className={`message-input ${onlyEmojis ? 'emoji-text' : ''}`}
        rows="1"
        placeholder={placeholder || "Type a message..."}
        value={text}
        onChange={handleInputChange}
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";
        }}
        onKeyDown={handleKeyPress}
        ref={textareaRef}
      />
    </div>
  );
};

export default ChatInput;
