import { useState } from "react";
import { logoutUser } from "../../../lib/firebase/auth";
import Modal from "../../common/modal/Modal";
import './LogoutConfirmModal.css'

const LogoutConfirmModal = ({ trigger }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Open the modal
  const handleOpen = () => setIsOpen(true);

  // Confirm logout
  const handleConfirm = () => {
    logoutUser();
    setIsOpen(false);
  };

  // Cancel logout
  const handleCancel = () => setIsOpen(false);

  return (
    <>
      {/* Logout Trigger Button (passed from parent) */}
      {trigger && trigger(handleOpen)}

      {/* Logout Confirmation Modal */}
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={handleCancel}
          onConfirm={handleConfirm}
          title="Log out?"
          description="Are you sure you want to log out? This will end your current session."
          confirmText="Log out"
          cancelText="Cancel"
        />
      )}
    </>
  );
};

export default LogoutConfirmModal;
