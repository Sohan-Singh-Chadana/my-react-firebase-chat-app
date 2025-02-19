import React, { useEffect, useRef } from "react";
import "./modal.css";
import { createPortal } from "react-dom";

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal">
      <div className="modal-content" ref={modalRef}>
        <p className="title">{title}</p>
        <p className="description">{description}</p>
        <div className="actionBtns">
          <button onClick={onClose} className="cancelBtn">{cancelText || "Cancel"}</button>
          <button onClick={onConfirm} className="confirmBtn" >{confirmText || "Confirm"}</button>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root")
  );
};

export default Modal;
