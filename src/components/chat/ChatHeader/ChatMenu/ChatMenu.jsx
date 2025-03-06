import { useChatStore } from "../../../../store";
import ChatMenuButton from "./ChatMenuButton";
import MenuContainer from "../../../common/menuContainer/MenuContainer";

const ChatMenu = ({
  setIsDeletedModalOpen,
  handleBlockShowModel,
  handleShowContactInfo,
  handleCloseChat,
  handleSelectMessages,
  handleShowClearChatModal,
}) => {
  const { isReceiverBlocked, isCurrentUserBlocked } = useChatStore();

  const blockText = isCurrentUserBlocked
    ? "You are Blocked!"
    : isReceiverBlocked
    ? "Unblock"
    : "Block";

  const chatMenuButtons = [
    { label: "Contact info", onClick: handleShowContactInfo },
    { label: "Select messages", onClick: handleSelectMessages },
    { label: "Add To favorites", onClick: null }, // No action yet
    { label: "Close chat", onClick: handleCloseChat },
    { label: blockText, onClick: handleBlockShowModel },
    { label: "Clear chat", onClick: handleShowClearChatModal },
    { label: "Delete chat", onClick: () => setIsDeletedModalOpen(true) },
  ];

  return (
    <MenuContainer
      menuId="actionMenuInChatTop"
      iconClass="icon"
      menuClass="modify-menu"
    >
      {chatMenuButtons.map((btn, index) => (
        <ChatMenuButton key={index} onClick={btn.onClick} label={btn.label} />
      ))}
    </MenuContainer>
  );
};

export default ChatMenu;
