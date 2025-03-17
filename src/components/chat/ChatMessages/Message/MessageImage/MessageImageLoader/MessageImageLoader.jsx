import { MdClose } from "react-icons/md";
import "./MessageImageLoader.css";
const MessageImageLoader = () => {
  return (
    <div className="loader-box">
      <div className="blurred-box"></div>
      <div className="loading-overlay">
        <div className="spinner"></div>
        <MdClose className="close-icon" size={24} />
      </div>
    </div>
  );
};

export default MessageImageLoader;
