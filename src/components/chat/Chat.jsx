import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker, { Emoji } from "emoji-picker-react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../lib/firebase/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
import {
  MdCameraAlt,
  MdEmojiEmotions,
  MdImage,
  MdLocalPhone,
  MdMic,
  MdMoreVert,
  MdOutlineAdd,
  MdSend,
  MdVideocam,
  MdInsertDriveFile,
  MdClose,
} from "react-icons/md";
import useGlobalStateStore from "../../lib/globalStateStore";
import dayjs from "dayjs";
import ChatMessages from "./ChatMessages";
import {
  listenAndMarkMessagesAsRead,
  markMessagesAsDelivered,
  markMessagesAsRead,
} from "../../utils/messageUtils";
import useSelectChats from "../../lib/selectChats";
import useMessagesStore from "../../lib/useMessageStore";

const Chat = () => {
  // const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({ file: null, url: "" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [imagePreview, setImagePreview] = useState(false);

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  const { setShowDetail } = useGlobalStateStore();
  const { chats } = useSelectChats();
  const { messages } = useMessagesStore();
  const chatMessages = messages[chatId] || [];

  const endRef = useRef(null);
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null); // Create ref for textarea

  // console.log(currentUser);

  // useEffect(() => {
  //   if (!chatId || !currentUser?.userId) return;

  //   const messagesRef = collection(db, "chats", chatId, "messages");
  //   const q = query(messagesRef, orderBy("timestamp", "asc"));

  //   const unSub = onSnapshot(q, async (snapshot) => {
  //     // 🔥 Ensure karo ki snapshot sync ho raha hai
  //     const msgs = await Promise.all(
  //       snapshot.docs.map(async (doc) => {
  //         const data = doc.data();
  //         return {
  //           id: doc.id,
  //           ...data,
  //         };
  //       })
  //     );

  //     // ✅ Filter karo deleted messages ko
  //     const filteredMessages = msgs.filter(
  //       (msg) => !(msg.deletedBy && msg.deletedBy.includes(currentUser.userId))
  //     );

  //     setMessages(filteredMessages);
  //     endRef.current?.scrollIntoView({ behavior: "smooth" });
  //   });

  //   return () => unSub();
  // }, [chatId, currentUser?.userId]);

  //! main
  // useEffect(() => {
  //   if (!chatId || !currentUser?.userId) return;

  //   const messagesRef = collection(db, "chats", chatId, "messages");
  //   const q = query(messagesRef, orderBy("timestamp", "asc"));

  //   const unSub = onSnapshot(q, (snapshot) => {
  //     const msgs = snapshot.docs
  //       .map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }))
  //       .filter((msg) => !msg.deletedBy?.includes(currentUser.userId)); // Exclude deleted messages

  //     setMessages(msgs);
  //     endRef.current?.scrollIntoView({ behavior: "smooth" });
  //   });

  //   return () => unSub();
  // }, [chatId, currentUser?.userId]);

  useEffect(() => {
    // Call `markMessagesAsDelivered` as soon as the chat app is opened (when `chatId` is set)
    if (chatId) {
      // console.log("Chat opened, marking messages as delivered");
      markMessagesAsDelivered(chatId);
    }
  }, [chatId]); // This will be triggered whenever the `chatId` changes (when a new chat is opened)

  useEffect(() => {
    // Call `markMessagesAsRead` when the chat is selected by the user
    if (chatId && currentUser?.userId) {
      const selectedChat = chats.find((chat) => chat.chatId === chatId);
      const receiverId = selectedChat?.user?.userId;

      // Only mark messages as read if the chat is for the receiver (not the current user)
      if (receiverId && receiverId !== currentUser.userId) {
        // console.log("Chat selected, marking messages as read");
        markMessagesAsRead(receiverId, chatId);
      }
    }
  }, [chatId, chats, currentUser?.userId]);

  useEffect(() => {
    if (!chatId || !currentUser?.userId) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unSub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(
          (msg) =>
            !msg.deletedBy?.includes(currentUser.userId) &&
            (!msg.deletedAt || !msg.deletedAt[currentUser.userId]) // Deleted मैसेज चेक करें
        );

      useMessagesStore.getState().setMessages(chatId, msgs); // ✅ Zustand स्टोर में अपडेट करें
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => unSub();
  }, [chatId, currentUser?.userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (!event.target.closest(".mdOutlineAdd")) {
          setMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // selected chat message automatically read
  // useEffect(() => {
  //   if (chatId && currentUser?.userId) {
  //     const unsubscribe = listenAndMarkMessagesAsRead(
  //       chatId,
  //       currentUser?.userId
  //     );
  //     return () => unsubscribe(); // Cleanup on chat change
  //   }
  // }, [chatId, currentUser?.userId]);

  const handleEmoji = (e) => setText((prev) => prev + e.emoji);

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

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

      // ✅ Reset `deletedAt` & `lastSeenAt` when a new message is sent
      await updateDoc(chatRef, {
        [`deletedAt.${currentUser.userId}`]: null, // ✅ Clear deleted timestamp
        [`deletedAt.${user.userId}`]: null, // ✅ Clear for the other user as well
        // [`lastSeenAt.${currentUser.userId}`]: null, // ✅ Clear last seen timestamp
        // [`lastSeenAt.${user.userId}`]: null, // ✅ Clear for other user too
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

  // const formatTimestamp = (timestamp) => {
  //   if (!timestamp) return "";
  //   return dayjs(timestamp.toDate()).format("hh:mm A");
  // };

  // console.log(messages);
  // console.log(imagePreview)

  const handleImagePreview = () => {
    fileInputRef.current.click();
    setImagePreview((prev) => !prev);
  };

  const handleImageRemove = () => {
    setImg({ file: null, url: "" });
    setImagePreview((prev) => !prev);
  };

  return (
    <div className="chat">
      <div className="top" onClick={() => setShowDetail(true)}>
        <div className="user">
          <img src={user?.profilePic || "/avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.name}</span>
            <p>Active now</p>
          </div>
        </div>
        <div className="icons">
          <MdLocalPhone />
          <MdVideocam />
          <MdMoreVert />
        </div>
      </div>

      <div className="chat-container">
        <div className="center">
          <ChatMessages messages={chatMessages} currentUser={currentUser} />

          {imagePreview && img.url && (
            <div className="image-preview">
              <div className="image-preview-container">
                <MdClose onClick={handleImageRemove} className="close" />
                <div className="image">
                  <img src={img.url} alt="" />
                </div>
                <div className="input-box">
                  <div className="emoji">
                    <MdEmojiEmotions onClick={() => setOpen((prev) => !prev)} />
                    {open && (
                      <div className="picker">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji} />
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Add a caption"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>

                <button
                  className="MediaSendBtn"
                  onClick={handleSend}
                  disabled={isCurrentUserBlocked || isReceiverBlocked}
                >
                  {text || img.file ? <MdSend /> : <MdMic />}
                </button>
              </div>
            </div>
          )}
          <div ref={endRef}></div>
        </div>

        <div className="bottom">
          {!(isCurrentUserBlocked || isReceiverBlocked) ? (
            <>
              <div className="icons">
                <MdOutlineAdd
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="mdOutlineAdd"
                />
                {menuOpen && (
                  <div className="popup-menu" ref={menuRef}>
                    <ul>
                      <li>
                        <MdInsertDriveFile /> <p>Document</p>
                      </li>
                      <li onClick={handleImagePreview}>
                        <MdImage /> <p>Photos & Videos</p>
                      </li>
                      <li>
                        <MdCameraAlt /> <p>Camera</p>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImg}
              />

              <div className="input-box">
                <div className="emoji">
                  <MdEmojiEmotions onClick={() => setOpen((prev) => !prev)} />
                  {open && (
                    <div className="picker">
                      <EmojiPicker open={open} onEmojiClick={handleEmoji} />
                    </div>
                  )}
                </div>
                <textarea
                  className="message-input"
                  rows="1"
                  placeholder="Type a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  ref={textareaRef}
                />
              </div>

              <button
                className="sendButton"
                onClick={handleSend}
                disabled={isCurrentUserBlocked || isReceiverBlocked}
              >
                {text || img.file ? <MdSend /> : <MdMic />}
              </button>
            </>
          ) : (
            <p className="block-text">
              Can&apos;t send a message to blocked user {user?.username}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
