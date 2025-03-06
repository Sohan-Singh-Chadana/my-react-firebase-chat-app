import { useEffect, useState } from "react";
import { MdClose, MdDelete } from "react-icons/md";
import { useChatStore, useMessageSelectionStore } from "../../../store";

import Modal from "../../common/modal/Modal";
import DeleteOptions from "./DeleteOptions";
import "./SelectionFooter.css";

const SelectionFooter = () => {
  const {
    selectedMessages,
    clearSelection,
    hideSelection,
    deleteForMe,
    deleteForEveryone,
    checkDeleteForEveryone,
    isDeleteForEveryoneAllowed,
    checkSenderForAllMessages,
    canDeleteForEveryone,
    isLoading,
  } = useMessageSelectionStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { chatId } = useChatStore();

  useEffect(() => {
    checkDeleteForEveryone();
    checkSenderForAllMessages();
  }, [
    chatId,
    selectedMessages,
    checkDeleteForEveryone,
    checkSenderForAllMessages,
  ]);

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

  const handleDeleteForMe = () => {
    deleteForMe();
    setIsModalOpen(false);
    hideSelection();
  };

  const handleDeleteForEveryone = () => {
    deleteForEveryone();
    setIsModalOpen(false);
    hideSelection();
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
          actionBtnShow={!canDeleteForEveryone}
          confirmText="Delete for Me"
        >
          {canDeleteForEveryone && (
            <DeleteOptions
              isDeleteForEveryoneAllowed={isDeleteForEveryoneAllowed}
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
