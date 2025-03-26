import { useCallback, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase/firebase";
import { useSelectChats, useUserStore } from "../store";

const useAddUser = () => {
  const [allUsers, setAllUsers] = useState([]); // ✅ Store all users
  const [existingChats, setExistingChats] = useState(new Set());
  const { currentUser } = useUserStore();
  const { chats } = useSelectChats();

  //* Fetch all users from Firestore
  const fetchAllUsers = useCallback(async () => {
    try {
      const usersRef = collection(db, "users");
      const userDocs = await getDocs(usersRef);
      return userDocs.docs
        .map((doc) => doc.data())
        .filter((user) => user.userId !== currentUser?.userId); // Remove self
    } catch (err) {
      console.error("Error fetching users:", err);
      return [];
    }
  }, [currentUser?.userId]);

  //* Fetch existing chat list
  const fetchExistingChats = useCallback(async () => {
    try {
      if (!currentUser?.userId) return new Set();

      const userRef = doc(db, "users", currentUser.userId);
      const userDoc = await getDoc(userRef);

      return userDoc.exists()
        ? new Set(userDoc.data().chatList?.map((chat) => chat.receiverId) || [])
        : new Set();
    } catch (err) {
      console.error("Error fetching chats:", err);
      return new Set();
    }
  }, [currentUser?.userId]);

  //* ✅ Fetch all users & user's existing chat list
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.userId) return;

      try {
        const users = await fetchAllUsers();
        setAllUsers(users); // ✅ Store all users

        const existingChatSet = await fetchExistingChats();
        setExistingChats(existingChatSet); // ✅ Update existing chat list
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [currentUser?.userId, chats, fetchAllUsers, fetchExistingChats]);

  // * getExisting Chats() function
  const getExistingChat = async (chatsRef, userId) => {
    const q = query(
      chatsRef,
      where("participants", "array-contains", currentUser.userId)
    );
    const querySnapshot = await getDocs(q);

    return (
      querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .find((chat) => chat.participants.includes(userId)) || null
    );
  };

  //* ✅ Create a new chat if it doesn't exist
  const createChat = async (chatsRef, user) => {
    const newChatRef = doc(chatsRef);

    await setDoc(newChatRef, {
      chatId: newChatRef.id,
      participants: [currentUser.userId, user.userId],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      deletedBy: [],
      deletedAt: {},
    });

    return newChatRef.id;
  };

  const updateDeletedStatus = async (existingChat, chatId) => {
    const updatedDeletedBy = (existingChat.deletedBy || []).filter(
      (id) => id !== currentUser.userId
    );
    const updatedDeletedAt = { ...(existingChat.deletedAt || {}) };
    delete updatedDeletedAt[currentUser.userId];

    if (
      updatedDeletedBy.length !== (existingChat.deletedBy || []).length ||
      JSON.stringify(updatedDeletedAt) !==
        JSON.stringify(existingChat.deletedAt || {})
    ) {
      await updateDoc(doc(db, "chats", chatId), {
        deletedBy: updatedDeletedBy,
        deletedAt: updatedDeletedAt,
      });
    }
  };

  const updateChatList = async (userRef, targetUser, chatId) => {
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const chatList = userData.chatList || [];

    const lastMessage = "";

    const updatedChatList = chatList.map((chat) =>
      chat.chatId === chatId
        ? {
            ...chat,
            lastMessage:
              userRef.id === currentUser.userId
                ? lastMessage
                : chat.lastMessage,
            updatedAt:
              userRef.id === currentUser.userId ? new Date() : chat.updatedAt,
          }
        : chat
    );

    if (!chatList.find((chat) => chat.chatId === chatId)) {
      updatedChatList.push({
        chatId,
        lastMessage,
        updatedAt: new Date(),
        receiverId: targetUser.userId,
        senderId: currentUser.userId,
      });
    }

    await updateDoc(userRef, { chatList: updatedChatList });
  };

  const handleAdd = async (user) => {
    if (!user || !user.userId || existingChats.has(user.userId)) return;

    try {
      const chatsRef = collection(db, "chats");
      const usersRef = collection(db, "users");

      setExistingChats((prev) => new Set([...prev, user.userId]));

      // ✅ Check if chat already exists
      const existingChat = await getExistingChat(chatsRef, user.userId);
      const chatId = existingChat
        ? existingChat.id
        : await createChat(chatsRef, user);

      if (existingChat) {
        await updateDeletedStatus(existingChat, chatId);
      }

      // ✅ Update chat list for both users
      const currentUserRef = doc(usersRef, currentUser.userId);
      const receiverUserRef = doc(usersRef, user.userId);

      await Promise.all([
        updateChatList(currentUserRef, user, chatId),
        updateChatList(receiverUserRef, currentUser, chatId),
      ]);
    } catch (err) {
      console.error("❌ Error adding user to chat:", err);
      setExistingChats((prev) => {
        const newSet = new Set(prev);
        newSet.delete(user.userId);
        return newSet;
      });
    }
  };

  return {
    allUsers,
    existingChats,
    handleAdd,
  };
};

export default useAddUser;
