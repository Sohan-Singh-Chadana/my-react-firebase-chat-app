import { memo } from "react";
import { MdLocalPhone, MdVideocam } from "react-icons/md";
import { useChatHandlers } from "../../../hooks";
import UserInfo from "./UserInfo";
import ChatMenu from "./ChatMenu";
import ChatActionButton from "./ChatActionButton";
import ChatModals from "./ChatModals";
import "./ChatHeader.css";

const ChatHeader = () => {
  const chatHandlers = useChatHandlers();

  return (
    <div className="top">
      {/* UserInfo Component */}
      <UserInfo />

      {/* Action Buttons */}
      <div className="icons">
        <ChatActionButton Icon={MdLocalPhone} />
        <ChatActionButton Icon={MdVideocam} />
        <ChatMenu {...chatHandlers} />
      </div>

       {/* ✅ Common Modal Component */}
       <ChatModals {...chatHandlers} />
    </div>
  );
};

export default memo(ChatHeader);