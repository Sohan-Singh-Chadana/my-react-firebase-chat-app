import { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/AddUser";
import { useUserStore } from "../../../store/userStore";
import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { useChatStore } from "../../../store/chatStore";
import useGlobalStateStore from "../../../store/globalStateStore";
import { MdCheck, MdDoneAll, MdOutlineArchive } from "react-icons/md";
import useSelectChats from "../../../store/chatSelectionStore";
import dayjs from "dayjs";
import { db } from "../../../lib/firebase/firebase";
import {
  listenAndMarkMessagesAsRead,
  listenForDeliveredMessages,
  listenForNewMessages,
  markAllMessagesAsDelivered,
} from "../../../utils/messageUtils";

const ChatList = () => {
  const { selectMode, searchInput } = useGlobalStateStore();
  const {
    selectedChats,
    addSelectedChat,
    removeSelectedChat,
    chats,
    setChats,
  } = useSelectChats();
  const { currentUser } = useUserStore();
  const { chatId, changeChat, resetChatId } = useChatStore();
  const [lastMessageData, setLastMessageData] = useState({});

  useEffect(() => {
    if (!currentUser?.uid) {
      console.error("⛔ [Error] No current user found!");
      return;
    }

    const userDocRef = doc(db, "users", currentUser.uid);

    const unsubscribeListeners = [];

    const unSub = onSnapshot(userDocRef, async (res) => {
      const userData = res.data();
      if (!userData) {
        console.error(
          "⛔ [Error] No user data found in Firestore for:",
          currentUser.uid
        );
        return;
      }

      const chatList = userData.chatList || [];

      if (chatList.length === 0) {
        console.warn("⚠️ [Warning] User has no chats.");
        setChats([]);
        return;
      }

      const fetchUserData = async (receiverId) => {
        try {
          const userDocRef = doc(db, "users", receiverId);
          const userDocSnap = await getDoc(userDocRef);
          return userDocSnap.exists() ? userDocSnap.data() : null;
        } catch (err) {
          console.error("❌ [Error] Error fetching user data:", err);
          return null;
        }
      };

      const chatData = await Promise.all(
        chatList.map(async (chat) => {
          const chatsRef = doc(db, "chats", chat.chatId);

          try {
            const chatSnap = await getDoc(chatsRef);
            if (!chatSnap.exists()) return null;

            const chatData = chatSnap.data();
            const user = await fetchUserData(chat.receiverId);
            if (!user) return null;

            if (chatData.deletedBy?.includes(currentUser.uid)) {
              const updatedDeletedBy = chatData.deletedBy.filter(
                (id) => id !== currentUser.uid
              );

              if (updatedDeletedBy.length !== chatData.deletedBy.length) {
                await updateDoc(chatsRef, { deletedBy: updatedDeletedBy });
              }
            }

            const messagesRef = collection(
              db,
              "chats",
              chat.chatId,
              "messages"
            );
            const qLastMessage = query(
              messagesRef,
              orderBy("timestamp", "desc"),
              limit(1)
            );

            const unsubscribeLastMessage = onSnapshot(
              qLastMessage,
              (snapshot) => {
                if (!snapshot.empty) {
                  const lastMessage = snapshot.docs[0].data();
                  setLastMessageData((prev) => ({
                    ...prev,
                    [chat.chatId]: lastMessage,
                  }));
                } else {
                  setLastMessageData((prev) => ({
                    ...prev,
                    [chat.chatId]: null,
                  }));
                }
              }
            );

            unsubscribeListeners.push(unsubscribeLastMessage);

            // Update unread count calculation
            const qUnreadCount = query(
              messagesRef,
              where("status", "in", ["sent", "delivered"]),
              where("receiverId", "==", currentUser?.uid)
            );
            const messagesSnap = await getDocs(qUnreadCount);
            const unreadCount = messagesSnap.size;

            return { ...chat, user, unreadCount };
          } catch (fetchError) {
            console.error(
              "❌ [Error] Fetching chat document failed:",
              chat.chatId,
              fetchError
            );
            return null;
          }
        })
      );

      const validChats = chatData.filter((chat) => chat !== null);
      setChats(
        validChats.sort(
          (a, b) => (b.updatedAt?.seconds ?? 0) - (a.updatedAt?.seconds ?? 0)
        )
      );

      return () => {
        unSub();
        unsubscribeListeners.forEach((unsub) => unsub());
      };
    });

    return () => {
      unSub();
      unsubscribeListeners.forEach((unsub) => unsub());
    };
  }, [currentUser?.uid, setChats, chatId]);

  useEffect(() => {
    let unsubscribeDelivered = null;
    let unsubscribeRead = null;
    let chatListeners = [];

    if (currentUser?.uid) {
      // 🔥 Mark all messages as delivered when the app opens
      markAllMessagesAsDelivered(currentUser.uid);

      // 🔥 Run again when user comes online
      const handleOnline = () => markAllMessagesAsDelivered(currentUser.uid);
      window.addEventListener("online", handleOnline);

      // ✅ Start real-time listener for new messages
      (async () => {
        chatListeners = await listenForNewMessages(currentUser.uid);
      })();

      // ✅ Listen for delivered & read messages when a chat is open
      if (chatId) {
        unsubscribeDelivered = listenForDeliveredMessages(
          chatId,
          currentUser.uid
        );
        unsubscribeRead = listenAndMarkMessagesAsRead(chatId, currentUser.uid);
      }

      return () => {
        window.removeEventListener("online", handleOnline);
        unsubscribeDelivered?.();
        unsubscribeRead?.();

        // ✅ Properly remove all real-time chat listeners
        chatListeners.forEach((unsubscribe) => unsubscribe());
      };
    }
  }, [chatId, currentUser?.uid]);

  // / Handle ChatList selection and reset unreadCount
  const handleChatSelect = async (chat, event) => {
    if (event?.target?.type === "checkbox") return;

    if (!chat?.chatId || !chat?.user) {
      console.error("Invalid chat object:", chat);
      return;
    }

    // Ensure `chats` is available before mapping
    if (!chats || !Array.isArray(chats)) {
      console.error("Chats state is invalid:", chats);
      return;
    }

    if (chatId === chat.chatId) {
      resetChatId();
      return;
    }

    // Update `isSeen` and unreadCount to 0 for the selected chat in the chats state
    const updatedChats = chats.map((item) =>
      item.chatId === chat.chatId
        ? { ...item, isSeen: true, unreadCount: 0 }
        : item
    );
    setChats(updatedChats);

    try {
      const userRef = doc(db, "users", currentUser?.uid);

      if (!currentUser?.uid) {
        console.error("Invalid currentUser:", currentUser);
        return;
      }

      const chatListToUpdate = updatedChats.map(({ user, ...rest }) => ({
        ...rest,
        userId: user?.userId || "",
        userName: user?.name || "",
      }));

      await updateDoc(userRef, { chatList: chatListToUpdate });
      changeChat(chat.chatId, chat.user); // Switch to the selected chat
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  };

  const handleDeleteSelectedChat = (chat) => {
    if (selectedChats.some((c) => c.chatId === chat.chatId)) {
      removeSelectedChat(chat.chatId);
    } else {
      addSelectedChat(chat);
    }
  };

  // const formatTimestamp = (timestamp) => {
  //   if (!timestamp) return "";
  //   return dayjs(timestamp * 1000).format("hh:mm A");
  // };

  // ✅ Fix `filteredChats` logic to handle `undefined` values
  const filteredChats = Array.isArray(chats)
    ? chats.filter((c) =>
        (c?.user?.name || "")
          .toLowerCase()
          .includes((searchInput || "").toLowerCase())
      )
    : [];

  // Function to get the Status Icon (You can replace this with your logic)
  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <MdCheck />; // Return component reference
      case "delivered":
        return <MdDoneAll />; // Return component reference
      case "read":
        // eslint-disable-next-line react/display-name
        return <MdDoneAll style={{ color: "#66b7dc" }} />;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    const date = dayjs(timestamp * 1000); // Convert Firestore timestamp to date
    const today = dayjs();
    const oneWeekAgo = today.subtract(7, "day");

    if (date.isSame(today, "day")) {
      return date.format("hh:mm A");
    }

    if (date.isSame(today.subtract(1, "day"), "day")) {
      return "Yesterday";
    }

    if (date.isAfter(oneWeekAgo)) {
      return date.format("dddd");
    }

    return date.format("DD/MM/YYYY"); // Show full date for older messages
  };

  return (
    <>
      <div className="chatList">
        <div className="archived">
          <MdOutlineArchive />
          <div className="archived-text">
            <p>Archived</p>
            <p className="archived-count">0</p>
          </div>
        </div>

        {filteredChats.map((chat) => {
          const lastMessageTime = formatTimestamp(chat.updatedAt?.seconds);

          return (
            <div
              key={chat.chatId}
              onClick={(event) => handleChatSelect(chat, event)}
              className={`chat-item ${
                chatId === chat.chatId ? "selected" : ""
              } ${selectMode ? "with-checkbox" : ""} ${
                chat.unreadCount > 0 ? "unread" : ""
              }`}
            >
              {selectMode && (
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={selectedChats.some((c) => c.chatId === chat.chatId)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleDeleteSelectedChat(chat);
                  }}
                />
              )}

              <div className="chat-content">
                <div className="avatar-container">
                  <img
                    src={
                      chat.user?.blockedUsers?.includes(currentUser?.uid)
                        ? "/default-avatar.png"
                        : chat.user?.profilePic || "/default-avatar.png"
                    }
                    alt="User Avatar"
                    className="avatar"
                  />
                </div>
                <div className="chat-info">
                  <div className="chat-header">
                    <h4>
                      {chat.user?.blockedUsers?.includes(currentUser?.uid)
                        ? "User"
                        : chat.user?.name || "Unknown"}
                    </h4>
                    <span className="time">{lastMessageTime}</span>
                  </div>
                  <p className="message-preview">
                    {lastMessageData?.[chat.chatId]?.senderId ===
                      currentUser?.userId &&
                      lastMessageData?.[chat.chatId]?.status &&
                      getStatusIcon(lastMessageData?.[chat.chatId]?.status)}
                    <span>
                      {/[a-zA-Z]/.test(chat.lastMessage) // Check if message contains English
                        ? chat.lastMessage.length > 40
                          ? chat.lastMessage.slice(0, 40) + "..."
                          : chat.lastMessage
                        : chat.lastMessage.split(/\s+/).length > 10 // For Hindi, allow 10 words
                        ? chat.lastMessage.split(/\s+/).slice(0, 15).join(" ") +
                          "..."
                        : chat.lastMessage}
                    </span>
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="message-count">{chat.unreadCount}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AddUser />
    </>
  );
};

export default ChatList;
