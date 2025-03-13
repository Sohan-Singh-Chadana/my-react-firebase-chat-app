import { MdBlock } from "react-icons/md";
import './MessageText.css'

const MessageText = ({ hasText, text, isDeleted }) => {
    
  const getMessageTextStyle = () => ({
    padding: hasText.split(" ").length >= 25 ? "4px 4px" : "0px",
  });

  return (
    <div
      className={`message-text ${isDeleted ? "deleteText" : ""}`}
      style={getMessageTextStyle()}
    >
      <pre>
        {isDeleted && <MdBlock />} {text}
      </pre>
    </div>
  );
};

export default MessageText;
