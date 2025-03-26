import { useEffect, useState } from "react";
import { MdDownload } from "react-icons/md";
import PropTypes from "prop-types";
import { useUserStore } from "../../../../../../../store";
import "./ImageList.css";

const ImageList = ({
  medias,
  currentImage,
  handleImageClick,
  handleDownload,
  imageListRef,
}) => {
  const { currentUser } = useUserStore();
  const [loadingStates, setLoadingStates] = useState({});
  const [hasLoaded, setHasLoaded] = useState(false); // ✅ Track first load only

  // ✅ Set loading states only on first load
  useEffect(() => {
    if (!hasLoaded) {
      const initialLoadingStates = medias.reduce((acc, media) => {
        acc[media.id] = true; // ✅ Show loader for all media initially
        return acc;
      }, {});
      setLoadingStates(initialLoadingStates);
    }
  }, [medias, hasLoaded]);

  // ✅ Handle Media Load Completion
  const handleMediaLoad = (id) => {
    setLoadingStates((prev) => ({
      ...prev,
      [id]: false, // ✅ Hide loader after load
    }));
  };

  // ✅ Mark first load complete after all media loads
  useEffect(() => {
    const allLoaded = Object.values(loadingStates).every(
      (state) => state === false
    );
    if (allLoaded && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [loadingStates, hasLoaded]);

  return (
    <div className="preview-content-footer">
      <div className="imageList">
        {medias.map((message, index) => {
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
              {/* ✅ Show Loader While Loading */}
              {loadingStates[message.id] && (
                <div className="media-loader">
                  <div className="spinner"></div>
                </div>
              )}

              {message.mediaType === "image" ? (
                <img
                  src={message.media}
                  alt="Preview"
                  className={`media-content ${
                    loadingStates[message.id] ? "hidden" : ""
                  }`}
                  onLoad={() => handleMediaLoad(message.id)}
                />
              ) : message.mediaType === "video" ? (
                <video
                  src={message.media}
                  className={`media-content ${
                    loadingStates[message.id] ? "hidden" : ""
                  }`}
                  onLoadedData={() => handleMediaLoad(message.id)}
                />
              ) : null}
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
  medias: PropTypes.array.isRequired,
  currentImage: PropTypes.object,
  handleImageClick: PropTypes.func.isRequired,
  handleDownload: PropTypes.func.isRequired,
  imageListRef: PropTypes.object.isRequired,
};

export default ImageList;
