import { FaAngleRight } from "react-icons/fa";
import "./ChatSettingItem.css";

const ChatSettingItem = ({ label, value = "", onClick = () => {} }) => {
  return (
    <div className="chat-setting-item" onClick={onClick}>
      <div className="chat-setting-status">
        <span className="chat-setting-label">{label}</span>
        <span className="chat-setting-value">{value}</span>
      </div>
      <FaAngleRight />
    </div>
  );
};

export default ChatSettingItem;
