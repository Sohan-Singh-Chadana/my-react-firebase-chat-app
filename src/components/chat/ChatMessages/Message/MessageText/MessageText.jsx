import { MdBlock } from "react-icons/md";
import "./MessageText.css";

const MessageText = ({ hasText, hasImageAndText, text, isDeleted }) => {
  const getMessageTextClass = () => {
    let classes = "";

    if (hasText.split(" ").length >= 25) {
      classes += "long-text ";
    }

    if (hasImageAndText) {
      classes += "image-text ";
    }

    return classes.trim();
  };

  return (
    <div
      className={`message-text ${
        isDeleted ? "deleteText" : ""
      } ${getMessageTextClass()}`}
    >
      <pre>
        {isDeleted && <MdBlock />} {text}
      </pre>
    </div>
  );
};

export default MessageText;
