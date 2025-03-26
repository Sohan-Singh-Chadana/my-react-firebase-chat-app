import { MdDownload } from "react-icons/md";
import "./BlurredImageDownload.css";

const BlurredImageDownload = ({
  handleDownload,
  message,
  onLoad,
  onError,
  mediaLoading,
}) => {
  return (
    <div
      className="blurred-image-container"
      onClick={() => handleDownload(message.id)}
    >
      {message.mediaType === "image" ? (
        <img
          src={message.media}
          alt="Message"
          className={`blurred-image ${mediaLoading ? "loaded" : ""}`}
          onLoad={onLoad}
          onError={onError}
          style={{ display: mediaLoading ? "none" : "block" }}
        />
      ) : message.mediaType === "video" ? (
        <video
          src={message.media}
          alt="Message"
          className={`blurred-image ${mediaLoading ? "loaded" : ""}`}
          onLoadedData={onLoad}
          onError={onError}
          style={{ display: mediaLoading ? "none" : "block" }}
        />
      ) : null}
      <div className="download-button">
        <MdDownload className="download-icon" />
        <span className="image-size">{message.mediaSize}</span>
      </div>
    </div>
  );
};

export default BlurredImageDownload;
