import { Bounce, toast } from "react-toastify";

const showToast = (messageText, options = {}) => {
  return toast(messageText, {
    position: "bottom-left",
    hideProgressBar: true,
    transition: Bounce,
    closeButton: false,

    style: {
      backgroundColor: "var(--bg-color)",
      color: "var(--toast-text-color)",
      borderRadius: "8px",
      padding: "5px 10px",
      fontSize: "16px",
      fontWeight: "500",
      width: "fit-content",
      minHeight: "50px",
    },
    ...options,
  });
};

export default showToast;
