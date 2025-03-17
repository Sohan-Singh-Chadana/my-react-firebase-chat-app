import { useState } from "react";
import { MdClose, MdDownload } from "react-icons/md";
import { useUserStore } from "../../../../../store";
import MessageImageLoader from "./MessageImageLoader";
import "./MessageImage.css";
import BlurredImageDownload from "./BlurredImageDownload";

const MessageImage = ({
  imageLoading,
  isSending,
  hasText,
  imageError,
  src,
  onLoad,
  onError,
  message,
}) => {
  const { currentUser } = useUserStore(); // ✅ Get current user
  const isOwnMessage = message.senderId === currentUser.userId; // ✅ Check if sender

  // ✅ Store download state in localStorage
  const [isDownloaded, setIsDownloaded] = useState(
    localStorage.getItem(`downloaded_${message.id}`) === "true"
  );

  // ✅ Function to mark image as downloaded
  const handleDownload = () => {
    localStorage.setItem(`downloaded_${message.id}`, "true");
    setIsDownloaded(true);
  };

  return (
    <>
      {/* ✅ Show loader for ALL images while fetching */}
      {imageLoading && <MessageImageLoader />}

      <div
        className={`image-box ${
          (!imageLoading && !hasText && isOwnMessage) || isDownloaded
            ? "with-gradient"
            : ""
        } ${isSending ? "sending" : ""}`} // ✅ isSending class
      >
        {imageError && (
          <div className="image-error">
            <MdClose size={24} />
          </div>
        )}

        {/* ✅ If sender, always show the normal image */}
        {isOwnMessage || isDownloaded ? (
          !imageError && (
            <img
              src={src}
              alt="message"
              onLoad={onLoad}
              onError={onError}
              style={{ display: imageLoading ? "none" : "block" }}
            />
          )
        ) : (
          <BlurredImageDownload
            handleDownload={handleDownload}
            message={message}
            onLoad={onLoad}
            onError={onError}
            imageLoading={imageLoading}
          />
        )}
      </div>
    </>
  );
};

export default MessageImage;
