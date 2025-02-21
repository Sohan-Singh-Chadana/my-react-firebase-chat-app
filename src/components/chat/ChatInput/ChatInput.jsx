import { useState, useRef, useEffect } from "react";
import { MdEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import "./ChatInput.css";

const ChatInput = ({ onSend, text, setText , placeholder = "" }) => {
  //   const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const emojiRef = useRef(null);
  const textareaRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        if (!event.target.closest(".emoji")) {
          setOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="input-box">
      <div className="emoji" ref={emojiRef}>
        <MdEmojiEmotions onClick={toggleEmojiPicker} />
        {open && (
          <div className="picker">
            <EmojiPicker
              open={open}
              onEmojiClick={handleEmoji}
              style={{ width: "500px" }}
            />
          </div>
        )}
      </div>
      <textarea
        className="message-input"
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
