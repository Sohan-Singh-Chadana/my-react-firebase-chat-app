import { createPortal } from "react-dom";
import { useOutsideClick } from "../../../hooks";
import "./modal.css";

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "",
  description = "",
  confirmText,
  cancelText,
  children,
}) => {
  const modalRef = useOutsideClick(onClose, isOpen);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal">
      <div className="modal-content" ref={modalRef}>
        {title && <p className="title">{title}</p>}
        {description && <p className="description">{description}</p>}
        {children && children}

        <div className="actionBtns">
          <button onClick={onClose} className="cancelBtn">
            {cancelText || "Cancel"}
          </button>
          <button onClick={onConfirm} className="confirmBtn">
            {confirmText || "Confirm"}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root")
  );
};

export default Modal;
