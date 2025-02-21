import { MdSend, MdMic } from "react-icons/md";
import "./SendButton.css";

const SendButton = ({ onClick, disabled, hasContent, className = "" }) => {
  return (
    <button className={`${className}`} onClick={onClick} disabled={disabled}>
      {hasContent ? <MdSend /> : <MdMic />}
    </button>
  );
};

export default SendButton;
