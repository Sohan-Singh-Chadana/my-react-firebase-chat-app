import { toast, Slide } from "react-toastify";

const showSuccessToast = (message) => {
  toast.success(message, {
    hideProgressBar: true,
    closeButton: false,
    transition: Slide, 
    autoClose: 5000, 

    style: {
      backgroundColor: "var(--bg-color)",
      color: "var(--toast-text-color)",
      borderRadius: "8px",
      padding: "8px 12px",
      fontSize: "16px",
      fontWeight: "500",
      width: "fit-content",
      minHeight: "50px",
    },
  });
};

export default showSuccessToast;
