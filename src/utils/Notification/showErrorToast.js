import { toast, Slide } from "react-toastify";

const showErrorToast = (message) => {
  toast.error(message, {
    hideProgressBar: true,
    closeButton: false,
    transition: Slide,
    autoClose: 5000,

    style: {
      backgroundColor: "var(--bg-color)",
      color: "#D32F2F",
      borderRadius: "8px",
      padding: "8px 12px",
      fontSize: "16px",
      fontWeight: "500",
      width: "fit-content",
      minHeight: "50px",
    },
  });
};

export default showErrorToast;
