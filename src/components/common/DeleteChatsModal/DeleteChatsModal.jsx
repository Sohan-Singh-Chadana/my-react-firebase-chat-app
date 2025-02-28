import Modal from "../modal/Modal";

const DeleteChatsModal = ({ isOpen, setIsOpen, onConfirm }) => {
  // Confirm delete action
  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  // Cancel delete action
  const handleCancel = () => setIsOpen(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      onConfirm={handleConfirm}
      title="Delete Chats?"
      description="Are you sure you want to delete selected chats?"
      confirmText="Yes, Delete"
      cancelText="Cancel"
    />
  );
};

export default DeleteChatsModal;
