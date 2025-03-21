import { useEffect, useState } from "react";

// * Firebase Firestore instance
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../lib/firebase/firebase";

// * Zustand state management hooks
import {
  useChatStore,
  useGlobalStateStore,
  useMessageSelectionStore,
  useNetworkStore,
  useSelectChats,
  useUserStore,
} from "../../../store";

// * Utility functions for filtering & sorting chats
import { filteredChats } from "../../../utils/chatList";
import { sortChatsByTimestamp } from "../../../utils";

// * Custom hooks for chat-related functionality
import { useChatListeners, useFetchChatDetails } from "../../../hooks";

// * Components for chat list UI
import AddUser from "./addUser/AddUser";
import ChatItem from "./ChatItem";
import OfflineAlert from "./OfflineAlert";
import ArchivedChats from "./ArchivedChats";
import ChatItemSkeleton from "./ChatItemSkeleton";

import "./chatList.css"; // * Chat list styling

const ChatList = () => {
  const { chatId } = useChatStore();
  const { currentUser } = useUserStore();
  const { searchInput } = useGlobalStateStore();
  const { setChats, chats } = useSelectChats();
  const isOnline = useNetworkStore((state) => state.isOnline);

  const fetchChatDetails = useFetchChatDetails();
  const [loading, setLoading] = useState(true);
  const [storedChatCount, setStoredChatCount] = useState(0);

  useEffect(() => {
    if (!currentUser?.uid) {
      console.error("⛔ [Error] No current user found!");
      return;
    }

    const userDocRef = doc(db, "users", currentUser.uid);
    const unsubscribeListeners = [];
    let timerId = null;

    const unSub = onSnapshot(userDocRef, async (res) => {
      const userData = res.data();
      if (!userData) return;

      const chatList = userData.chatList || [];
      if (chatList.length === 0) return setChats([]);

      const chatData = await Promise.all(
        chatList.map((chat) => fetchChatDetails(chat, unsubscribeListeners))
      );
      const validChats = chatData.filter((chat) => chat !== null);
      setChats(validChats.sort(sortChatsByTimestamp));

      timerId = setTimeout(() => {
        setLoading(false);
      }, 1500);
    });

    const { clearSelection, hideSelection } =
      useMessageSelectionStore.getState();

    clearSelection();
    hideSelection();

    return () => {
      unSub();
      unsubscribeListeners.forEach((unSub) => unSub());
      clearTimeout(timerId);
    };
  }, [currentUser.uid, chatId, setChats, fetchChatDetails]);

  // ✅ Filter Chats
  const getFilteredChats = filteredChats(searchInput) || [];

  // ✅ Load stored chat length from localStorage
  useEffect(() => {
    const savedChatCount = localStorage.getItem("chatCount");
    if (savedChatCount) {
      setStoredChatCount(parseInt(savedChatCount, 10));
    }
  }, []);

  // ✅ Save chat length after fetching
  useEffect(() => {
    if (!loading && chats.length > 0) {
      localStorage.setItem("chatCount", chats.length.toString());
    }
  }, [loading, chats]);

  // ✅ Determine the number of skeletons to display
  const skeletonCount = chats.length > 0 ? chats.length : storedChatCount || 0;

  // Event Handlers
  useChatListeners();

  return (
    <>
      <div className="chatList">
        {/* 🔴 Show alert if offline */}
        {!isOnline && <OfflineAlert />}

        {/* Archived Chats */}
        <ArchivedChats />

        {/* ✅ Show Skeletons Only When Loading */}
        {loading ? (
          <>
            {skeletonCount > 0 ? (
              [...Array(skeletonCount)].map((_, index) => (
                <ChatItemSkeleton key={index} />
              ))
            ) : (
              <div className="no-chats">
                <span>🤔 Looks like you have no chats yet! </span>
                <span> 🚀 Start a new conversation now!</span>
              </div>
            )}
          </>
        ) : (
          // ✅ Show actual chat items after loading completes
          getFilteredChats &&
          getFilteredChats.length > 0 &&
          getFilteredChats.map((chat) => (
            <ChatItem key={chat.chatId} chat={chat} />
          ))
        )}
      </div>

      <AddUser />
    </>
  );
};

export default ChatList;
