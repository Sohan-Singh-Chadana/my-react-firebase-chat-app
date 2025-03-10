import { useState } from "react";
import {
  useChatStore,
  useGlobalStateStore,
  useMenuStore,
  useMessageSelectionStore,
  useUserStore,
} from "../../store";
import { deleteSingleChat, resetUnreadCount } from "../../utils";

export const useChatHandlers = () => {
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const [isClearChatModalOpen, setIsClearChatModalOpen] = useState(false);

  const { setMenuOpen } = useMenuStore();
  const { currentUser } = useUserStore.getState();
  const { chatId, resetChatId, clearChatForMe } = useChatStore();
  const { showSelection } = useMessageSelectionStore();
  const { setShowDetail } = useGlobalStateStore();

  const handleBlockShowModel = () => {
    setIsBlockedModalOpen(true);
    setMenuOpen("actionMenuInChatTop", false);
  };

  // handle contact info
  const handleShowContactInfo = () => {
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

  const handleShowClearChatModal = () => {
    setIsClearChatModalOpen(true);
    setMenuOpen("actionMenuInChatTop", false);
  };

  const handleClearChat = () => {
    clearChatForMe();
    setIsClearChatModalOpen(false);
  };

  return {
    isDeletedModalOpen,
    isBlockedModalOpen,
    isClearChatModalOpen,
    setIsDeletedModalOpen,
    setIsBlockedModalOpen,
    setIsClearChatModalOpen,
    handleBlockShowModel,
    handleShowContactInfo,
    handleCloseChat,
    handleDeleteChat,
    handleSelectMessages,
    handleShowClearChatModal,
    handleClearChat,
  };
};
