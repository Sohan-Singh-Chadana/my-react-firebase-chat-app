import { useEffect, useRef, useState } from "react";
import {
  useChatStore,
  useMessagesStore,
  useUserStore,
} from "../../../../../store";
import MessageImageLoader from "./MessageImageLoader";
import ZoomableImage from "./ZoomableImage";
import ImagePreviewModal from "./ImagePreviewModal";
import MessageImageContainer from "./MessageImageContainer";
import { downloadMessageImage } from "../../../../../utils/firebase/downloads/imageDownloadUtils";
import "./MessageImage.css";

const MessageImage = ({
  imageLoading,
  isSending,
  hasText,
  imageError,
  src,
  onLoad,
  onError,
  message,
}) => {
  const { currentUser } = useUserStore(); // ✅ Get current user
  const { chatId } = useChatStore();
  const { messages } = useMessagesStore();
  const chatMessages = messages[chatId] || [];

  const images = chatMessages.filter((message) => message.img);
  const [imageIndex, setImageIndex] = useState(0);

  const isOwnMessage = message.senderId === currentUser.userId; // ✅ Check if sender
  const [isDownloaded, setIsDownloaded] = useState(
    message.downloadedBy?.includes(currentUser.userId)
  );

  const handleDownload = async (messageId) => {
    try {
      const success = await downloadMessageImage(
        chatId,
        messageId,
        currentUser
      );
      if (success) {
        setIsDownloaded(true);
      }
    } catch (err) {
      console.error("❌ Error downloading image:", err);
    }
  };

  // ✅ Image Preview Modal State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const imageListRef = useRef([]);

  const currentImage = images[imageIndex]; // ✅ Get current image

  useEffect(() => {
    if (imageListRef.current[imageIndex]) {
      imageListRef.current[imageIndex].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [imageIndex]);

  return (
    <>
      {/* ✅ Show loader for ALL images while fetching */}
      {imageLoading && <MessageImageLoader />}

      <MessageImageContainer
        imageProps={{
          imageLoading,
          imageError,
          src,
          onLoad,
          onError,
          isSending,
          hasText,
        }}
        downloadProps={{
          isDownloaded,
          handleDownload,
        }}
        modalProps={{
          setImageIndex,
          setIsPreviewOpen,
          message,
          images,
          isOwnMessage,
        }}
      />

      {/* ✅ Image Preview Modal */}
      {isPreviewOpen && (
        <ImagePreviewModal
          setImageIndex={setImageIndex}
          images={images}
          currentImage={currentImage}
          setIsPreviewOpen={setIsPreviewOpen}
          handleDownload={handleDownload}
          setIsZoomModalOpen={setIsZoomModalOpen}
          imageIndex={imageIndex}
          imageListRef={imageListRef}
        />
      )}

      {isZoomModalOpen && (
        <ZoomableImage
          src={currentImage.img}
          onClose={() => setIsZoomModalOpen(false)}
        />
      )}
    </>
  );
};

export default MessageImage;
