import { useEffect, useState } from "react";
import { MdClose, MdDelete } from "react-icons/md";
import { useChatStore, useMessageSelectionStore } from "../../../store";
import { showToast } from "../../../utils";

import Modal from "../../common/modal/Modal";
import DeleteOptions from "./DeleteOptions";
import "./SelectionFooter.css";
import { toast } from "react-toastify";

const SelectionFooter = () => {
  const selectedMessages = useMessageSelectionStore(
    (state) => state.selectedMessages
  );
  const hideSelection = useMessageSelectionStore(
    (state) => state.hideSelection
  );
  const {
    clearSelection,
    deleteForMe,
    deleteForEveryone,
    isDeleteForEveryoneAllowed,
    checkDeleteForEveryoneAndSender,
    isLoading,
  } = useMessageSelectionStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { chatId } = useChatStore();

  useEffect(() => {
    checkDeleteForEveryoneAndSender();
  }, [chatId, checkDeleteForEveryoneAndSender, selectedMessages]);

  const openDeleteModal = async () => {
    if (selectedMessages.length > 0) {
      setIsModalOpen(true);
    }
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
  };

  const closeSelection = () => {
    clearSelection();
    hideSelection();
  };

  const handleDeleteForMe = async () => {
    try {
      hideSelection();
      setIsModalOpen(false);

      // 🟡 Step 1: Show "Deleting..." message
      const toastId = showToast("Deleting...", { autoClose: false });

      await deleteForMe(); // ✅ Ensure delete happens first

      // ✅ Step 2: Update Toast to "Message Deleted"
      const messageText = `${selectedMessages.length} ${
        selectedMessages.length > 1 ? "Messages" : "Message"
      } deleted for you.`;

      toast.update(toastId, {
        render: messageText,
        autoClose: 3000, // ✅ Same Toast ID (update instead of new toast)
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      showToast("Failed to delete message.");
    }
  };

  const handleDeleteForEveryone = async () => {
    try {
      hideSelection();
      setIsModalOpen(false);

      // 🟡 Step 1: Show "Deleting..." message
      const toastId = showToast("Deleting...", { autoClose: false });

      await deleteForEveryone(); // ✅ Ensure delete happens first

      // ✅ Step 2: Update the existing Toast with a new message
      const messageText = `${selectedMessages.length} ${
        selectedMessages.length > 1 ? "Messages" : "Message"
      } deleted for everyone.`;

      toast.update(toastId, {
        render: messageText,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      showToast("Failed to delete message.");
    }
  };

  return (
    <>
      <div className="selectionFooter">
        <div className="selection-content">
          <button className="close-btn" onClick={closeSelection}>
            <MdClose />
          </button>

          <span className="selected-text">
            {selectedMessages.length} selected
          </span>
        </div>

        <button
          className="delete-btn"
          onClick={openDeleteModal}
          disabled={isLoading || selectedMessages.length === 0}
        >
          <MdDelete />
        </button>
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteForMe}
          description={`Delete ${
            selectedMessages.length > 1 ? "messages" : "message"
          } ?`}
          actionBtnShow={!isDeleteForEveryoneAllowed}
          confirmText="Delete for Me"
        >
          {isDeleteForEveryoneAllowed && (
            <DeleteOptions
              onDeleteForEveryone={handleDeleteForEveryone}
              onDeleteForMe={handleDeleteForMe}
              onCancel={closeDeleteModal}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default SelectionFooter;
