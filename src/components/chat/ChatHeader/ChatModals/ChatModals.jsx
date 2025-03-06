import BlockAction from "../../../common/BlockAction";
import DeleteChatsModal from "../../../common/DeleteChatsModal";
import Modal from "../../../common/modal/Modal";

const ChatModals = ({
  isBlockedModalOpen,
  setIsBlockedModalOpen,
  isClearChatModalOpen,
  setIsClearChatModalOpen,
  handleClearChat,
  isDeletedModalOpen,
  setIsDeletedModalOpen,
  handleDeleteChat,
}) => {
  return (
    <div>
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

export default ChatModals;
