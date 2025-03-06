import { useEffect, useState } from "react";
import { MdOutlineArchive } from "react-icons/md"; // * Archive icon

// * Firebase Firestore instance
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../lib/firebase/firebase";

// * Zustand state management hooks
import {
  useChatStore,
  useGlobalStateStore,
  useMessageSelectionStore,
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

import "./chatList.css"; // * Chat list styling

const ChatList = () => {
  const { chatId } = useChatStore();
  const { currentUser } = useUserStore();
  const { searchInput } = useGlobalStateStore();
  const { setChats } = useSelectChats();

  const fetchChatDetails = useFetchChatDetails();

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
      if (chatList.length === 0) return setChats([]);

      const chatData = await Promise.all(
        chatList.map((chat) => fetchChatDetails(chat, unsubscribeListeners))
      );
      const validChats = chatData.filter((chat) => chat !== null);
      setChats(validChats.sort(sortChatsByTimestamp));
    });

    const { clearSelection, hideSelection } = useMessageSelectionStore.getState();

    clearSelection();
    hideSelection();

    return () => {
      unSub();
      unsubscribeListeners.forEach((unSub) => unSub());
    };
  }, [currentUser.uid, chatId, setChats, fetchChatDetails]);

  // Event Handlers
  useChatListeners();

  // ✅ Filter Chats
  const getFilteredChats = filteredChats(searchInput);

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

        {getFilteredChats.map((chat) => (
          <ChatItem key={chat.chatId} chat={chat} />
        ))}
      </div>

      <AddUser />
    </>
  );
};

export default ChatList;
