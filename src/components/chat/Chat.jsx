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
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import ScrollToBottomButton from "./ScrollToBottomButton/ScrollToBottomButton.jsx";
import SelectionFooter from "./SelectionFooter";
import MediaDocPreviewPopup from "./MediaDocPreviewPopup";

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

const Chat = () => {
  const [mediaDocPreview, setMediaDocPreview] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { chatId, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
  const { messages } = useMessagesStore();
  const {
    sendMessage,
    text,
    setText,
    media,
    setMedia,
    document,
    setDocument,
    sendingMessage,
  } = useMessageSender();
  const { showCheckboxes } = useMessageSelectionStore();
  const { hoveredWallpaper, selectedWallpaper, showWallpaperImage } =
    useWallpaperStore();
  const chatMessages = messages[chatId] || [];

  const fileInputMediaRef = useRef(null);
  const fileInputDocumentRef = useRef(null);

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

    setMediaDocPreview(false);
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

  const handleMediaPreview = () => {
    if (fileInputMediaRef.current) {
      fileInputMediaRef.current.value = ""; // ✅ Reset file input before selecting new file
    }

    fileInputMediaRef.current.click();
    setMediaDocPreview(true);
  };

  const handleMediaDocumentRemove = () => {
    setMedia({ file: null, url: "", type: "" });
    setDocument({ file: null, url: "", name: "" });

    // ✅ Reset media/document preview if required
    if (typeof setMediaDocPreview === "function") {
      setMediaDocPreview(false);
    }

    if (fileInputMediaRef.current) {
      fileInputMediaRef.current.value = ""; // ✅ Reset file input
    }
    if (fileInputDocumentRef.current) {
      fileInputDocumentRef.current.value = "";
    }
  };

  const handleDocumentPreview = () => {
    if (fileInputDocumentRef.current) {
      fileInputDocumentRef.current.value = "";
    }
    fileInputDocumentRef.current.click();
    setMediaDocPreview(true);
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
          {mediaDocPreview && (media.url || document.url) && (
            <MediaDocPreviewPopup
              media={media}
              document={document}
              text={text}
              setText={setText}
              onSend={handleSend}
              onRemove={handleMediaDocumentRemove}
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
            handleMediaPreview={handleMediaPreview}
            handleDocumentPreview={handleDocumentPreview}
            fileInputMediaRef={fileInputMediaRef}
            fileInputDocumentRef={fileInputDocumentRef}
            handleSend={handleSend}
            text={text}
            setText={setText}
            media={media}
            setMedia={setMedia}
            document={document}
            setDocument={setDocument}
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
