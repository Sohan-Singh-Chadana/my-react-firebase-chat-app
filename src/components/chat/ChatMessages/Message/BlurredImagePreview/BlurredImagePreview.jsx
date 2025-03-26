import { MdClose } from "react-icons/md";
import "./BlurredImagePreview.css";

const BlurredImagePreview = ({ mediaSrc, mediaType }) => {
  return (
    <div className="blurred-preview">
      {mediaType === "image" ? (
        <img
          src={mediaSrc}
          className="blurred-image-preview"
          alt="Uploading..."
        />
      ) : mediaType === "video" ? (
        <video
          src={mediaSrc}
          className="blurred-image-preview"
          autoPlay={false}
          loop={false}
        />
      ) : null}
      <div className="spinnerB"></div>
      <MdClose className="close-iconB" size={24} />
    </div>
  );
};

export default BlurredImagePreview;
