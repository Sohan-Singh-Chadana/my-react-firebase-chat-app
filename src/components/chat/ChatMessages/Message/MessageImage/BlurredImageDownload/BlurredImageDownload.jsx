import { MdDownload } from "react-icons/md";
import "./BlurredImageDownload.css";

const BlurredImageDownload = ({
  handleDownload,
  message,
  onLoad,
  onError,
  imageLoading,
}) => {
  return (
    <div className="blurred-image-container" onClick={() => handleDownload(message.id)}>
      <img
        src={message.img}
        alt="Message"
        className={`blurred-image ${imageLoading ? "loaded" : ""}`}
        onLoad={onLoad}
        onError={onError}
        style={{ display: imageLoading ? "none" : "block" }}
      />
      <div className="download-button">
        <MdDownload className="download-icon" />
        <span className="image-size">{message.imgSize} KB</span>
      </div>
    </div>
  );
};

export default BlurredImageDownload;
