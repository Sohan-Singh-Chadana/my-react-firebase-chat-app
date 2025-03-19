import ImagePreviewHeader from "./ImagePreviewHeader";
import ImageNavigation from "./ImageNavigation";
import ImageList from "./ImageList";
import "./ImagePreviewModal.css";

const ImagePreviewModal = ({
  setImageIndex,
  images,
  currentImage,
  setIsPreviewOpen,
  handleDownload,
  setIsZoomModalOpen,
  imageIndex,
  imageListRef,
}) => {
  const handleImageClick = (index) => {
    setImageIndex(index);
  };

  const handleNextImage = () => {
    setImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const captionText = currentImage?.text;

  return (
    <div className="image-preview-modal">
      <div className="preview-container">
        <ImagePreviewHeader
          currentImage={currentImage}
          setIsPreviewOpen={setIsPreviewOpen}
        />

        <div
          className="preview-content"
          onClick={(e) => {
            if (
              e.target === e.currentTarget ||
              e.target.classList.contains("preview-image")
            ) {
              setIsPreviewOpen(false);
            }
          }}
        >
          <div
            className={`preview-image ${captionText ? "has-caption" : ""}`}
            onClick={() => setIsPreviewOpen(false)}
          >
            <figure>
              <img
                // src={src}
                src={currentImage.img}
                alt="Preview"
                onClick={(e) => {
                  e.stopPropagation(); // ✅ Stop closing when clicking the image
                  setIsZoomModalOpen(true);
                }}
              />
            </figure>
            <span className="caption-text">{captionText}</span>
          </div>

          {/* ✅ Previous/Next Buttons */}
          <ImageNavigation
            handleNextImage={handleNextImage}
            handlePrevImage={handlePrevImage}
            imageIndex={imageIndex}
            totalImages={images.length}
          />
        </div>

        {/* ✅ Thumbnail List */}
        <ImageList
          images={images}
          currentImage={currentImage}
          handleImageClick={handleImageClick}
          handleDownload={handleDownload}
          imageListRef={imageListRef}
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;
