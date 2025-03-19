import { MdDownload } from "react-icons/md";
import PropTypes from "prop-types";
import { useUserStore } from "../../../../../../../store";
import "./ImageList.css";

const ImageList = ({
  images,
  currentImage,
  handleImageClick,
  handleDownload,
  imageListRef,
}) => {
  const { currentUser } = useUserStore();

  return (
    <div className="preview-content-footer">
      <div className="imageList">
        {images.map((message, index) => {
          const isDownloaded = message.downloadedBy?.includes(
            currentUser.userId
          );

          return isDownloaded ? (
            <div
              className={`imageBox ${
                currentImage.id === message.id ? "active" : ""
              }`}
              key={message.id}
              onClick={() => handleImageClick(index)}
              ref={(el) => (imageListRef.current[index] = el)}
            >
              <img src={message.img} alt="" />
            </div>
          ) : (
            <div
              className="imageDownloadBox"
              key={index}
              onClick={() => handleDownload(message.id)}
            >
              <div className="overlayIcon">
                <MdDownload size={25} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

ImageList.propTypes = {
    images: PropTypes.array.isRequired,
    currentImage: PropTypes.object,
    handleImageClick: PropTypes.func.isRequired,
    handleDownload: PropTypes.func.isRequired,
    imageListRef: PropTypes.object.isRequired,
  };

export default ImageList;
