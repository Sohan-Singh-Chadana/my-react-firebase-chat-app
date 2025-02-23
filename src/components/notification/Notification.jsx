import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./toastStyles.css";

const Notification = () => {
  return (
    <div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Notification;
