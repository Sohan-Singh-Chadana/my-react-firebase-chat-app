import { memo, useState } from "react";
import { MdLocalPhone, MdVideocam } from "react-icons/md";

import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import "dayjs/locale/en"; // English locale (optional)

import DeleteChatsModal from "../../common/DeleteChatsModal";
import MenuContainer from "../../common/menuContainer/MenuContainer";

import { useTypingStatusListener, useUserStatus } from "../../../hooks";

import {
  useChatStore,
  useGlobalStateStore,
  useMenuStore,
  useMessageSelectionStore,
  useUserStore,
} from "../../../store";
import { deleteSingleChat, resetUnreadCount } from "../../../utils";

import "./ChatHeader.css";
import BlockAction from "../../common/BlockAction";
import Modal from "../../common/modal/Modal";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale("en"); // Set locale to English

const ChatHeader = () => {
  const { setMenuOpen } = useMenuStore();
  const { chatId, resetChatId, user, clearChatForMe } = useChatStore();
  const { isReceiverBlocked, isCurrentUserBlocked } = useChatStore();
  const { currentUser } = useUserStore.getState();
  const userStatus = useUserStatus();
  const typingStatus = useTypingStatusListener();
  const { setShowDetail } = useGlobalStateStore();
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const [isClearChatModalOpen, setIsClearChatModalOpen] = useState(false);
  const { showSelection } = useMessageSelectionStore();

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

  const handleBlockShowModel = () => {
    setIsBlockedModalOpen(true);
    setMenuOpen("actionMenuInChatTop", false);
  };

  // handle contact info
  const handleContactInfo = () => {
    setShowDetail(true);
    setMenuOpen("actionMenuInChatTop", false);
  };

  const handleCloseChat = async () => {
    resetChatId();
    await resetUnreadCount(chatId, currentUser.uid);
    setMenuOpen("actionMenuInChatTop", false);
  };

  const handleDeleteChat = () => {
    deleteSingleChat();
    setIsDeletedModalOpen(false);
    setMenuOpen("actionMenuInChatTop", false);
  };

  const handleSelectMessages = () => {
    showSelection();
    setMenuOpen("actionMenuInChatTop", false);
  };

  const showClearChatModel = () => {
    setIsClearChatModalOpen(true);
    setMenuOpen("actionMenuInChatTop", false);
  };

  const handleClearChat = () => {
    clearChatForMe();
    setIsClearChatModalOpen(false);
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
          <button onClick={handleSelectMessages}>Select messages</button>
          <button>Add To favorites</button>
          <button onClick={handleCloseChat}>Close chat</button>
          <button onClick={handleBlockShowModel}>
            {isCurrentUserBlocked
              ? "You are Blocked!"
              : isReceiverBlocked
              ? `Unblock`
              : `Block`}
          </button>
          <button onClick={showClearChatModel}>Clear chat</button>
          <button onClick={() => setIsDeletedModalOpen(true)}>
            Delete chat
          </button>
        </MenuContainer>
      </div>

      {isBlockedModalOpen && (
        <BlockAction
          showConfirm={isBlockedModalOpen}
          setShowConfirm={setIsBlockedModalOpen}
        />
      )}

      {isClearChatModalOpen && (
        <Modal
          isOpen={isClearChatModalOpen}
          onClose={() => setIsClearChatModalOpen(false)}
          onConfirm={handleClearChat}
          title={`Clear this chat?`}
          description={`This chat will be cleared for you, but it will remain visible in your chat list.`}
          confirmText={`Clear chat`}
          cancelText="Cancel"
        />
      )}

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

export default memo(ChatHeader);
