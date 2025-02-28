import PropTypes from "prop-types";
import { MdLocalPhone, MdVideocam } from "react-icons/md";

import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import "dayjs/locale/en"; // English locale (optional)
import "./ChatHeader.css";

import MenuContainer from "../../common/menuContainer/MenuContainer";
import useMenuStore from "../../../store/menuStore";
import { useChatStore } from "../../../store/chatStore";
import { useState } from "react";
import DeleteChatsModal from "../../common/DeleteChatsModal";
import { useUserStore } from "../../../store/userStore";
import { deleteSingleChat } from "../../../utils/deleteSingleChat";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale("en"); // Set locale to English

const ChatHeader = ({ user, userStatus, typingStatus, setShowDetail }) => {
  const { setMenuOpen } = useMenuStore();
  const { chatId, resetChatId } = useChatStore();
  const { currentUser } = useUserStore.getState();
  const { isReceiverBlocked, isCurrentUserBlocked } = useChatStore();
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return "Offline";

    const now = dayjs();
    const lastSeenDate = dayjs(lastSeen);

    if (lastSeenDate.isSame(now, "day")) {
      return `Last seen Today at ${lastSeenDate.format("h:mm A")}`;
    } else if (lastSeenDate.isSame(now.subtract(1, "day"), "day")) {
      return `Last seen Yesterday at ${lastSeenDate.format("h:mm A")}`;
    } else {
      return `Last seen on ${lastSeenDate.format("DD/MM/YYYY [at] h:mm A")}`;
    }
  };

  // handle contact info
  const handleContactInfo = () => {
    setShowDetail(true);
    setMenuOpen("actionMenuInChatTop", false);
  };

  const handleCloseChat = () => {
    resetChatId();
    setMenuOpen("actionMenuInChatTop", false);
  };

  const handleDeleteChat = () => {
    deleteSingleChat();
    setIsDeletedModalOpen(false);
    setMenuOpen("actionMenuInChatTop", false);
  };

  return (
    <div className="top">
      <div className="user" onClick={() => setShowDetail(true)}>
        <img src={user?.profilePic || "/default-avatar.png"} alt="" />
        <div className="user-info">
          <span className="name">
            {isCurrentUserBlocked ? "Unknown User" : user?.name}
          </span>
          {!(isReceiverBlocked || isCurrentUserBlocked) ? (
            userStatus.status === "online" ? (
              <span className="online-status">
                {!typingStatus?.isTyping ? "Online" : "Typing..."}
              </span>
            ) : userStatus.lastSeen ? (
              <span className="last-seen">
                {formatLastSeen(userStatus.lastSeen)}
              </span>
            ) : (
              <span className="offline-status">Offline</span>
            )
          ) : null}
        </div>
      </div>
      <div className="icons">
        <div className="icon">
          <MdLocalPhone />
        </div>
        <div className="icon">
          <MdVideocam />
        </div>
        <MenuContainer
          menuId="actionMenuInChatTop"
          iconClass="icon"
          menuClass="modify-menu"
        >
          <button onClick={handleContactInfo}>Contact info</button>
          <button>Select messages</button>
          <button>Add To favorites</button>
          <button onClick={handleCloseChat}>Close chat</button>
          <button>Block</button>
          <button>Clear chat</button>
          <button onClick={() => setIsDeletedModalOpen(true)}>
            Delete chat
          </button>
        </MenuContainer>
      </div>

      {isDeletedModalOpen && (
        <DeleteChatsModal
          isOpen={isDeletedModalOpen}
          setIsOpen={setIsDeletedModalOpen}
          onConfirm={handleDeleteChat}
        />
      )}
    </div>
  );
};

// Props validation
ChatHeader.propTypes = {
  user: PropTypes.shape({
    profilePic: PropTypes.string,
    name: PropTypes.string.isRequired,
  }).isRequired,
  userStatus: PropTypes.shape({
    status: PropTypes.oneOf(["online", "offline"]).isRequired,
    lastSeen: PropTypes.instanceOf(Date),
  }).isRequired,
  typingStatus: PropTypes.shape({
    isTyping: PropTypes.bool,
  }),
  setShowDetail: PropTypes.func.isRequired,
};

export default ChatHeader;
