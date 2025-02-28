import { useEffect, useRef, useState } from "react";
import "./chat.css";
import {
  addDoc,
  collection,
  deleteField,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase/firebase";
import { useChatStore } from "../../store/chatStore.js";
import { useUserStore } from "../../store/userStore.js";
import upload from "../../utils/upload.js";
import useGlobalStateStore from "../../store/globalStateStore.js";
import dayjs from "dayjs";
import ChatMessages from "./ChatMessages";
import {
  listenAndMarkMessagesAsRead,
  listenForDeliveredMessages,
  markMessagesAsDelivered,
} from "../../utils/messageUtils";
import useMessagesStore from "../../store/messageStore.js";
import {
  listenToUserStatus,
  setUserOffline,
  setUserOnline,
} from "../../hooks/useUserStatus";

import { useTypingStatusListener } from "../../hooks";
import setTypingStatus from "./../../hooks/useTypingStatus.js";
import ImagePreviewPopup from "./ImagePreviewPopup";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import { MdKeyboardArrowDown } from "react-icons/md";
import getWallpaperColor from "../../utils/getWallpaperColor.js";
import useWallpaperStore from "../../store/useWallpaperStore.js";

const Chat = () => {
  // const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [img, setImg] = useState({ file: null, url: "" });
  const [imagePreview, setImagePreview] = useState(false);
  const [showScrollToBottomBtn, setShowScrollToBottomBtn] = useState(false);
  const [userStatus, setUserStatus] = useState({
    status: "offline",
    lastSeen: null,
  });

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  const { setShowDetail } = useGlobalStateStore();
  const { messages, setMessages } = useMessagesStore();
  const chatMessages = messages[chatId] || [];
  const typingStatus = useTypingStatusListener(user?.userId);
  const { hoveredWallpaper, selectedWallpaper, showWallpaperImage } =
    useWallpaperStore();

  const endRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null); // Create ref for textarea
  const topToBottomBtnRef = useRef(null);
  const chatContainerRef = useRef(null);

  // In your Chat component
  useEffect(() => {
    if (chatId && currentUser?.uid) {
      markMessagesAsDelivered(chatId, currentUser.uid);
      const unsubscribeDelivered = listenForDeliveredMessages(
        chatId,
        currentUser.uid
      );
      const unsubscribeRead = listenAndMarkMessagesAsRead(
        chatId,
        currentUser.uid
      );

      return () => {
        unsubscribeDelivered();
        unsubscribeRead();
      };
    }
  }, [chatId, currentUser?.uid]);

  useEffect(() => {
    if (!chatId || !currentUser?.userId) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    endRef.current?.scrollIntoView({ behavior: "smooth" });

    const unSub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(
          (msg) =>
            !msg.deletedBy?.includes(currentUser.userId) &&
            (!msg.deletedAt || !msg.deletedAt[currentUser.userId])
        );

      endRef.current?.scrollIntoView({ behavior: "smooth" });
      // useMessagesStore.getState().setMessages(chatId, msgs);
      setMessages(chatId, msgs);
    });

    return () => unSub();
  }, [chatId, currentUser?.userId]);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle Scroll event
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, scrollTop, clientHeight } =
        chatContainerRef.current;
      const scrollOffset = 100;

      // Show button if user scrolls up slightly
      if (scrollTop + clientHeight < scrollHeight - scrollOffset) {
        setShowScrollToBottomBtn(true);
      } else {
        setShowScrollToBottomBtn(false);
      }
    }
  };

  // Attach scroll event listener
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleSend = async () => {
    if ((!text && !img.file) || isCurrentUserBlocked || isReceiverBlocked)
      return;

    if (!currentUser?.userId || !user?.userId) {
      console.error("❌ Error: currentUser or user is undefined");
      return;
    }

    let imgUrl = null;
    try {
      if (img.file) imgUrl = await upload(img.file);

      const messagesRef = collection(db, "chats", chatId, "messages");
      const chatRef = doc(db, "chats", chatId);
      const senderRef = doc(db, "users", currentUser.uid);
      const receiverRef = doc(db, "users", user.userId);

      const timestamp = serverTimestamp();
      const formattedDate = dayjs().format("YYYY-MM-DD"); // ✅ Store formatted date

      const newMessage = {
        senderId: currentUser.userId,
        receiverId: user.userId,
        senderName: currentUser.name,
        receiverName: user.name,
        text: text || "",
        img: imgUrl || "",
        timestamp,
        formattedDate, // ✅ Add this field
        status: "sent",
        deletedBy: [],
      };

      await addDoc(messagesRef, newMessage);

      // // ✅ Reset `deletedAt` & `lastSeenAt` when a new message is sent
      // await updateDoc(chatRef, {
      //   [`deletedAt.${currentUser.userId}`]: null, // ✅ Clear deleted timestamp
      //   [`deletedAt.${user.userId}`]: null, // ✅ Clear for the other user as well
      // });

      await updateDoc(chatRef, {
        [`deletedAt.${currentUser.userId}`]: deleteField(), // 🔥 Key will be removed
        [`deletedAt.${user.userId}`]: deleteField(), // 🔥 Removes from Firestore
      });

      // ✅ Function to update user's chatList while preserving all other fields
      const updateChatList = async (userRef, targetUser) => {
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return;

        const userData = userSnap.data();
        const chatList = userData.chatList || [];

        // Update only lastMessage & updatedAt while keeping other fields unchanged
        const updatedChatList = chatList.map((chat) =>
          chat.chatId === chatId
            ? {
                ...chat,
                lastMessage: text || "Image",
                updatedAt: new Date(),
                unreadCount: 0, // Reset unread count
              }
            : chat
        );

        // If chat does not exist, add a new entry
        if (!updatedChatList.find((chat) => chat.chatId === chatId)) {
          updatedChatList.push({
            chatId,
            isSeen: false, // Set to false since it's a new message
            lastMessage: text || "Image",
            receiverId: targetUser.userId,
            senderId:
              targetUser === currentUser ? user.userId : currentUser.userId,
            updatedAt: new Date(),
            userId: targetUser.userId,
            userName: targetUser.name,
          });
        }

        await updateDoc(userRef, { chatList: updatedChatList });
      };

      // ✅ Update chat list for both sender and receiver
      await Promise.all([
        updateChatList(senderRef, user),
        updateChatList(receiverRef, currentUser),
      ]);

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      setImg({ file: null, url: "" });
      setText("");
      setImagePreview(false);
      endRef.current?.scrollIntoView({ behavior: "smooth" });

      // console.log(`✅ Message sent to ${user.name}`);
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  };

  const handleImagePreview = () => {
    fileInputRef.current.click();
    setImagePreview(true);
  };

  const handleImageRemove = () => {
    setImg({ file: null, url: "" });
    setImagePreview(false);
  };

  useEffect(() => {
    if (chatId && user?.userId) {
      const unsubscribe = listenToUserStatus(user.userId, setUserStatus);
      return () => unsubscribe(); // Cleanup on component unmount or chat change
    }
  }, [chatId, user?.userId]);

  useEffect(() => {
    if (!currentUser?.userId) return;

    // Set user online when the component mounts
    setUserOnline(currentUser.userId);

    // Set user offline when the component unmounts
    return () => {
      setUserOffline(currentUser.userId);
    };
  }, [currentUser?.userId]);

  // Track typing status
  useEffect(() => {
    let typingTimeout;

    if (text.trim()) {
      // User is typing
      setTypingStatus(currentUser.userId, chatId, true);

      // Clear typing status after 3 seconds of inactivity
      typingTimeout = setTimeout(() => {
        setTypingStatus(currentUser.userId, chatId, false);
      }, 3000);
    } else {
      // User stopped typing
      setTypingStatus(currentUser.userId, chatId, false);
    }

    return () => {
      clearTimeout(typingTimeout);
    };
  }, [text, currentUser?.userId, chatId]);

  return (
    <div className="chat">
      <ChatHeader
        user={user}
        userStatus={userStatus}
        typingStatus={typingStatus}
        setShowDetail={setShowDetail}
      />

      <div className="chat-container">
        <div
          className="center"
          ref={chatContainerRef}
          style={getWallpaperColor(
            hoveredWallpaper,
            selectedWallpaper,
            showWallpaperImage
          )}
        >
          <ChatMessages messages={chatMessages} currentUser={currentUser} />
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

        <ChatFooter
          handleImagePreview={handleImagePreview}
          fileInputRef={fileInputRef}
          handleSend={handleSend}
          text={text}
          setText={setText}
          img={img}
          setImg={setImg}
        />

        <button
          className={
            showScrollToBottomBtn ? " topToBottomBtn active" : "topToBottomBtn"
          }
          ref={topToBottomBtnRef}
          onClick={scrollToBottom}
        >
          <MdKeyboardArrowDown />
        </button>
      </div>
    </div>
  );
};

export default Chat;
