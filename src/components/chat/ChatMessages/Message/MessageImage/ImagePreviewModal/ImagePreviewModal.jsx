import ImagePreviewHeader from "./ImagePreviewHeader";
import ImageNavigation from "./ImageNavigation";
import ImageList from "./ImageList";
import MediaPreview from "./MediaPreview";
import "./ImagePreviewModal.css";


const ImagePreviewModal = ({
  setImageIndex,
  medias,
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
    setImageIndex((prev) => (prev + 1) % medias.length);
  };

  const handlePrevImage = () => {
    setImageIndex((prev) => (prev - 1 + medias.length) % medias.length);
  };

  const handlePreviewClose = (e) => {
    // ✅ Check if the target is the container or the preview image
    if (
      e.target === e.currentTarget ||
      e.target.classList.contains("preview-image")
    ) {
      setIsPreviewOpen(false);
    }
  };

  const handleImageZoomOpen = (e) => {
    e.stopPropagation(); // ✅ Stop closing when clicking the image
    setIsZoomModalOpen(true);
  };

  const captionText = currentImage?.text;

  return (
    <div className="image-preview-modal">
      <div className="preview-container">
        <ImagePreviewHeader
          currentImage={currentImage}
          setIsPreviewOpen={setIsPreviewOpen}
        />

        <div className="preview-content" onClick={handlePreviewClose}>
          <div
            className={`preview-image ${captionText ? "has-caption" : ""}`}
            onClick={() => setIsPreviewOpen(false)}
          >
            <MediaPreview
              currentImage={currentImage}
              handleImageZoomOpen={handleImageZoomOpen}
            />
            <span className="caption-text text-selection-not-allow">
              {captionText}
            </span>
          </div>

          {/* ✅ Previous/Next Buttons */}
          <ImageNavigation
            handleNextImage={handleNextImage}
            handlePrevImage={handlePrevImage}
            imageIndex={imageIndex}
            totalImages={medias.length}
          />
        </div>

        {/* ✅ Thumbnail List */}
        <ImageList
          medias={medias}
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
