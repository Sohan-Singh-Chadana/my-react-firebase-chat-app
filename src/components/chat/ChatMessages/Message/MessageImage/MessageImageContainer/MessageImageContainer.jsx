import { MdClose } from "react-icons/md";
import BlurredImageDownload from "../BlurredImageDownload";
import "./MessageImageContainer.css";

const MessageImageContainer = ({ imageProps, downloadProps, modalProps }) => {
  const { imageLoading, imageError, src, onLoad, onError, isSending, hasText } =
    imageProps;
  const { isDownloaded, handleDownload } = downloadProps;
  const { setImageIndex, setIsPreviewOpen, message, images, isOwnMessage } =
    modalProps;

  return (
    <div
      className={`image-box ${
        (!imageLoading && !hasText && isOwnMessage) || isDownloaded
          ? "with-gradient"
          : ""
      } ${isSending ? "sending" : ""}`} // ✅ isSending class
      onClick={() => {
        if (isOwnMessage || isDownloaded) {
          setImageIndex(images.findIndex((img) => img.id === message.id));
          setIsPreviewOpen(true);
        }
      }}
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
  );
};

export default MessageImageContainer;
