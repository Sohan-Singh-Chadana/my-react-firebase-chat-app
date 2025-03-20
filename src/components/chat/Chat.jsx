import { useRef, useState } from "react";

// * Zustand stores for managing global chat states
import {
  useChatStore,
  useMessageSelectionStore,
  useMessagesStore,
  useWallpaperStore,
} from "../../store";

// * Chat-related UI components
import ChatMessages from "./ChatMessages";
import ImagePreviewPopup from "./ImagePreviewPopup";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import ScrollToBottomButton from "./ScrollToBottomButton/ScrollToBottomButton.jsx";

// * Utility function to get wallpaper color for chat background
import { getWallpaperColor } from "../../utils";

import "./chat.css"; // * Chat styling

// * Custom hooks for chat functionality
import {
  updateChatLists, // ✅ Updates chat list when a new message is sent/received
  useAutoScroll, // ✅ Automatically scrolls to the latest message
  useChatMessages, // ✅ Fetches and manages chat messages
  useMessageSender, // ✅ Handles message sending logic
  useMessageStatus, // ✅ Manages message status (sent, delivered, read)
  useScrollButton, // ✅ Controls scroll-to-bottom button visibility
  useTypingStatus, // ✅ Tracks and updates typing status
  useVisibilityChange, // ✅ Detects visibility changes (active/inactive tab)
} from "../../hooks";
import SelectionFooter from "./SelectionFooter";

const Chat = () => {
  const [imagePreview, setImagePreview] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { chatId, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
  const { messages } = useMessagesStore();
  const { sendMessage, text, setText, img, setImg, sendingMessage } =
    useMessageSender();
  const { showCheckboxes } = useMessageSelectionStore();
  const { hoveredWallpaper, selectedWallpaper, showWallpaperImage } =
    useWallpaperStore();
  const chatMessages = messages[chatId] || [];

  const fileInputRef = useRef(null);

  // fetch Messages
  useChatMessages();

  // fetch Message Status
  useMessageStatus(unreadCount, setUnreadCount);

  // Tab/window change hua, reset unread count
  useVisibilityChange();

  // Attach scroll event listener
  const { chatContainerRef, showScrollBtn, scrollToBottom, userScrolledUp } =
    useScrollButton();
  const { endRef } = useAutoScroll(messages);

  const handleSend = async () => {
    if (isCurrentUserBlocked || isReceiverBlocked) return;

    setImagePreview(false);
    const success = await sendMessage();

    if (success) {
      await updateChatLists(text);
    } else {
      console.error("❌ Message sending failed. Chat list update skipped.");
    }

    if (!userScrolledUp.current) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleImagePreview = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // ✅ Reset file input before selecting new file
    }

    fileInputRef.current.click();
    setImagePreview(true);
  };

  const handleImageRemove = () => {
    setImg({ file: null, url: "" });
    setImagePreview(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // ✅ Reset file input
    }
  };

  // Typing status
  useTypingStatus(text);

  const centerElementStyle = {
    ...getWallpaperColor(
      hoveredWallpaper,
      selectedWallpaper,
      showWallpaperImage
    ),
  };

  return (
    <div className="chat">
      <ChatHeader />

      <div className="chat-container">
        <div
          className="center"
          ref={chatContainerRef}
          style={centerElementStyle}
        >
          <ChatMessages messages={chatMessages} unreadCount={unreadCount} />
          {imagePreview && img.url && (
            <ImagePreviewPopup
              img={img}
              text={text}
              setText={setText}
              onSend={handleSend}
              onRemove={handleImageRemove}
              isCurrentUserBlocked={isCurrentUserBlocked}
              isReceiverBlocked={isReceiverBlocked}
            />
          )}
          <div ref={endRef}></div>
        </div>

        {showCheckboxes ? (
          <SelectionFooter />
        ) : (
          <ChatFooter
            handleImagePreview={handleImagePreview}
            fileInputRef={fileInputRef}
            handleSend={handleSend}
            text={text}
            setText={setText}
            img={img}
            setImg={setImg}
            sendingMessage={sendingMessage} // ✅ Pass sendingMessage to ChatFooter
          />
        )}

        <ScrollToBottomButton
          showScrollBtn={showScrollBtn}
          scrollToBottom={scrollToBottom}
        />
      </div>
    </div>
  );
};

export default Chat;
