import { MdClose } from "react-icons/md";
import MessageImageLoader from "./MessageImageLoader";
import "./MessageImage.css";

const MessageImage = ({
  imageLoading,
  isSending,
  hasText,
  imageError,
  src,
  onLoad,
  onError,
}) => {

  return (
    <>
      {imageLoading && <MessageImageLoader />}


      <div
        className={`image-box ${
          !imageLoading && !hasText ? "with-gradient" : ""
        } ${isSending ? "sending" : ""}`} // ✅ isSending class
      >
        {imageError && (
          <div className="image-error">
            <MdClose size={24} />
          </div>
        )}

        {!imageError && (
          <img
            src={src}
            alt="message"
            onLoad={onLoad}
            onError={onError}
            style={{ display: imageLoading ? "none" : "block" }}
          />
        )}
      </div>
    </>
  );
};

export default MessageImage;
