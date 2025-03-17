import { MdClose } from "react-icons/md";
import "./BlurredImagePreview.css"

const BlurredImagePreview = ({imgSrc}) => {
  return (
    <div className="blurred-preview">
      <img
        src={imgSrc}
        className="blurred-image-preview"
        alt="Uploading..."
      />
      <div className="spinnerB"></div>
      <MdClose className="close-iconB" size={24} />
    </div>
  );
};

export default BlurredImagePreview;
