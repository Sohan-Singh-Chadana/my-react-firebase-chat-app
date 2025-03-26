import { MdClose, MdPlayArrow } from "react-icons/md";
import BlurredImageDownload from "../BlurredImageDownload";
import "./MessageImageContainer.css";

const MessageImageContainer = ({ imageProps, downloadProps, modalProps }) => {
  const { mediaLoading, imageError, src, onLoad, onError, isSending, hasText } =
    imageProps;
  const { isDownloaded, handleDownload } = downloadProps;
  const { setImageIndex, setIsPreviewOpen, message, medias, isOwnMessage } =
    modalProps;

  return (
    <div
      className={`image-box ${
        (!mediaLoading && !hasText && isOwnMessage) || isDownloaded
          ? "with-gradient"
          : ""
      } ${isSending ? "sending" : ""}`} // ✅ isSending class
      onClick={() => {
        if (isOwnMessage || isDownloaded) {
          setImageIndex(medias.findIndex((media) => media.id === message.id));
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
        !imageError && message.mediaType === "image" ? (
          <img
            src={src}
            alt="message"
            onLoad={onLoad}
            onError={onError}
            style={{ display: mediaLoading ? "none" : "block" }}
          />
        ) : message.mediaType === "video" ? (
          <>
            <video
              src={src}
              alt="message"
              autoPlay={false}
              loop={false}
              controls={false}
              onLoadedData={onLoad}
              onError={onError}
              style={{
                display: mediaLoading ? "none" : "block",
                maxWidth: "100%", // ✅ Responsive video
                borderRadius: "8px",
              }}
            />
            <button className="play-btn">
              <MdPlayArrow size={24} />
            </button>
          </>
        ) : (
          <div>Error: Media type not supported</div>
        )
      ) : (
        <BlurredImageDownload
          handleDownload={handleDownload}
          message={message}
          onLoad={onLoad}
          onError={onError}
          mediaLoading={mediaLoading}
        />
      )}
    </div>
  );
};

export default MessageImageContainer;
