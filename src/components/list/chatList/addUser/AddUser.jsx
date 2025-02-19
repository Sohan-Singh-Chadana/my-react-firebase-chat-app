import {
  arrayUnion,
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

import { db } from "../../../../lib/firebase/firebase";
import { memo, useState, useCallback, useEffect } from "react";
import { useUserStore } from "../../../../lib/userStore";
import { MdArrowBack } from "react-icons/md";
import useGlobalStateStore from "../../../../lib/globalStateStore";
import SearchBox from "../../../common/searchBox/SearchBox";
import "./addUser.css";
import useSelectChats from "../../../../lib/selectChats";

const AddUser = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [existingChats, setExistingChats] = useState(new Set());
  const { currentUser } = useUserStore();
  const { addMode, setAddMode } = useGlobalStateStore();
  const [searchInput, setSearchInput] = useState("");
  const { chats } = useSelectChats();

  // Fetch user's existing chat list to prevent duplicate additions
  useEffect(() => {
    const fetchUserChats = async () => {
      if (!currentUser?.userId) return; // ✅ Ensure user is available

      try {
        const userRef = doc(db, "users", currentUser.userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const chatList = userDoc.data().chatList || [];
          const chatSet = new Set(chatList.map((chat) => chat.receiverId));

          setExistingChats(chatSet); // ✅ Update existing chat list
        }
      } catch (err) {
        console.error("Error fetching user chats:", err);
      }
    };

    fetchUserChats();
  }, [currentUser?.userId, chats]); // ✅ Added optional chaining for safety

  // Handle user search
  const handleSearch = useCallback(
    async (e) => {
      e.preventDefault();
      setUser(null);
      setError("");

      const searchName = searchInput.trim().toLowerCase(); // ✅ Trim and lowercase

      if (!searchName) {
        setError("Please enter a name.");
        return;
      }

      if (searchName === currentUser.name.toLowerCase()) {
        setError("You cannot add yourself.");
        return;
      }

      try {
        const userRef = collection(db, "users");
        const q = query(userRef, where("name", "==", searchName)); // 🔍 Search by "name"
        const querySnapShot = await getDocs(q);

        if (!querySnapShot.empty) {
          const userData = querySnapShot.docs[0].data();

          // ✅ Check if user is already added
          if (existingChats.has(userData.userId)) {
            setError("User is already added.");
            return;
          }

          setUser(userData);
        } else {
          setError("User not found.");
        }
      } catch (err) {
        console.error("Error searching for user:", err);
        setError("Error searching for user.");
      }
    },
    [searchInput, currentUser.name, existingChats]
  );

  // ! main  =>  Handle adding a new chat
  // const handleAdd = useCallback(async () => {
  //   if (!user || existingChats.has(user.userId)) return;

  //   try {
  //     const chatsRef = collection(db, "chats");
  //     const usersRef = collection(db, "users");

  //     // ✅ Check if chat already exists
  //     const q = query(
  //       chatsRef,
  //       where("participants", "array-contains", currentUser.userId)
  //     );
  //     const querySnapshot = await getDocs(q);

  //     let existingChat = null;
  //     querySnapshot.forEach((doc) => {
  //       const chat = doc.data();
  //       if (chat.participants.includes(user.userId)) {
  //         existingChat = { id: doc.id, ...chat };
  //       }
  //     });

  //     let chatId;
  //     if (existingChat) {
  //       chatId = existingChat.id; // ✅ Use the existing chat

  //       // ✅ Remove current user from `deletedBy` if they re-add the chat
  //       const updatedDeletedBy = (existingChat.deletedBy || []).filter(
  //         (id) => id !== currentUser.userId
  //       );

  //       if (updatedDeletedBy.length !== existingChat.deletedBy.length) {
  //         await updateDoc(doc(chatsRef, chatId), {
  //           deletedBy: updatedDeletedBy,
  //         });
  //       }
  //     } else {
  //       // ✅ Create a new chat if it doesn't exist
  //       const newChatRef = doc(chatsRef);
  //       chatId = newChatRef.id;

  //       await setDoc(newChatRef, {
  //         chatId,
  //         participants: [currentUser.userId, user.userId],
  //         createdAt: serverTimestamp(),
  //         updatedAt: serverTimestamp(),
  //         deletedBy: [], // ✅ No one has deleted it initially
  //         deletedAt: {},
  //       });
  //     }

  //     // ✅ Current user’s chatList update
  //     const currentUserRef = doc(usersRef, currentUser.userId);
  //     const currentUserSnap = await getDoc(currentUserRef);
  //     const currentChatList = currentUserSnap.exists()
  //       ? currentUserSnap.data().chatList || []
  //       : [];

  //     // ✅ Receiver’s (other user's) chatList update
  //     const receiverUserRef = doc(usersRef, user.userId);
  //     const receiverUserSnap = await getDoc(receiverUserRef);
  //     const receiverChatList = receiverUserSnap.exists()
  //       ? receiverUserSnap.data().chatList || []
  //       : [];

  //     // ✅ Remove old entry if it already exists in chatList
  //     const updatedCurrentChatList = currentChatList.filter(
  //       (chat) => chat.chatId !== chatId
  //     );

  //     const updatedReceiverChatList = receiverChatList.filter(
  //       (chat) => chat.chatId !== chatId
  //     );

  //     // ✅ Add only one entry in the chat list
  //     const newChatData = {
  //       chatId,
  //       lastMessage: "",
  //       updatedAt: new Date(),
  //       receiverId: user.userId,
  //     };

  //     await updateDoc(currentUserRef, {
  //       chatList: [...updatedCurrentChatList, newChatData], // ✅ No duplicates in currentUser's list
  //     });

  //     await updateDoc(receiverUserRef, {
  //       chatList: [
  //         ...updatedReceiverChatList,
  //         { ...newChatData, receiverId: currentUser.userId },
  //       ], // ✅ No duplicates in receiver's list
  //     });

  //     // ✅ State update
  //     setExistingChats((prev) => new Set([...prev, user.userId]));
  //     setUser(null);
  //   } catch (err) {
  //     console.error("❌ Error adding user to chat:", err);
  //     setError("Error adding user.");
  //   }
  // }, [user, currentUser.userId, existingChats]);

  // const handleAdd = useCallback(async () => {
  //   if (!user || existingChats.has(user.userId)) return;

  //   try {
  //     const chatsRef = collection(db, "chats");
  //     const usersRef = collection(db, "users");

  //     const q = query(
  //       chatsRef,
  //       where("participants", "array-contains", currentUser.userId)
  //     );
  //     const querySnapshot = await getDocs(q);

  //     let existingChat = null;
  //     querySnapshot.forEach((doc) => {
  //       const chat = doc.data();
  //       if (chat.participants.includes(user.userId)) {
  //         existingChat = { id: doc.id, ...chat };
  //       }
  //     });

  //     let chatId;
  //     if (existingChat) {
  //       chatId = existingChat.id; // Use the existing chat

  //       // Remove current user from `deletedBy` if they re-add the chat
  //       const updatedDeletedBy = (existingChat.deletedBy || []).filter(
  //         (id) => id !== currentUser.userId
  //       );

  //       // Remove deletedAt for the current user
  //       const updatedDeletedAt = { ...(existingChat.deletedAt || {}) };
  //       delete updatedDeletedAt[currentUser.userId];

  //       if (
  //         updatedDeletedBy.length !== existingChat.deletedBy.length ||
  //         updatedDeletedAt !== existingChat.deletedAt
  //       ) {
  //         await updateDoc(doc(chatsRef, chatId), {
  //           deletedBy: updatedDeletedBy,
  //           deletedAt: updatedDeletedAt,
  //         });
  //       }
  //     } else {
  //       // Create a new chat if it doesn't exist
  //       const newChatRef = doc(chatsRef);
  //       chatId = newChatRef.id;

  //       await setDoc(newChatRef, {
  //         chatId,
  //         participants: [currentUser.userId, user.userId],
  //         createdAt: serverTimestamp(),
  //         updatedAt: serverTimestamp(),
  //         deletedBy: [], // No one has deleted it initially
  //         deletedAt: {}, // No one has deleted messages yet
  //       });
  //     }

  //     // Update the current user’s and receiver’s chatList
  //     const currentUserRef = doc(usersRef, currentUser.userId);
  //     const receiverUserRef = doc(usersRef, user.userId);

  //     // Update chatList for current user and receiver
  //     await Promise.all([
  //       updateChatList(currentUserRef, user, chatId),
  //       updateChatList(receiverUserRef, currentUser, chatId),
  //     ]);

  //     setExistingChats((prev) => new Set([...prev, user.userId]));
  //     setUser(null);
  //   } catch (err) {
  //     console.error("Error adding user to chat:", err);
  //     setError("Error adding user.");
  //   }
  // }, [user, currentUser.userId, existingChats ]);

  // const updateChatList = async (userRef, targetUser, chatId) => {
  //   const userSnap = await getDoc(userRef);
  //   if (!userSnap.exists()) return;

  //   const userData = userSnap.data();
  //   const chatList = userData.chatList || [];

  //   const updatedChatList = chatList.map((chat) =>
  //     chat.chatId === chatId
  //       ? {
  //           ...chat,
  //           lastMessage: "New message",
  //           updatedAt: new Date(),
  //         }
  //       : chat
  //   );

  //   // If chat does not exist, add a new entry
  //   if (!updatedChatList.find((chat) => chat.chatId === chatId)) {
  //     updatedChatList.push({
  //       chatId,
  //       isSeen: false,
  //       lastMessage: "New message",
  //       receiverId: targetUser.userId,
  //       updatedAt: new Date(),
  //       userId: targetUser.userId,
  //       userName: targetUser.name,
  //     });
  //   }

  //   await updateDoc(userRef, { chatList: updatedChatList });
  // };

  const handleAdd = useCallback(async () => {
    if (!user || !user.userId || existingChats.has(user.userId)) return;

    try {
      const chatsRef = collection(db, "chats");
      const usersRef = collection(db, "users");

      // ✅ Check if chat already exists
      const q = query(
        chatsRef,
        where("participants", "array-contains", currentUser.userId)
      );
      const querySnapshot = await getDocs(q);

      let existingChat = null;
      querySnapshot.forEach((doc) => {
        const chat = doc.data();
        if (chat.participants.includes(user.userId)) {
          existingChat = { id: doc.id, ...chat };
        }
      });

      let chatId;
      if (existingChat) {
        chatId = existingChat.id;

        // ✅ Remove current user from `deletedBy`
        const updatedDeletedBy = (existingChat.deletedBy || []).filter(
          (id) => id !== currentUser.userId
        );

        // ✅ Remove deletedAt for the current user
        const updatedDeletedAt = { ...(existingChat.deletedAt || {}) };
        delete updatedDeletedAt[currentUser.userId];

        // ✅ Fix object comparison
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
      } else {
        // ✅ Create a new chat if it doesn't exist
        const newChatRef = doc(chatsRef);
        chatId = newChatRef.id;

        await setDoc(newChatRef, {
          chatId,
          participants: [currentUser.userId, user.userId],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          deletedBy: [],
          deletedAt: {},
        });
      }

      // ✅ Update chat list for both users
      const currentUserRef = doc(usersRef, currentUser.userId);
      const receiverUserRef = doc(usersRef, user.userId);

      await Promise.all([
        updateChatList(currentUserRef, user, chatId),
        updateChatList(receiverUserRef, currentUser, chatId),
      ]);

      setExistingChats((prev) => new Set([...prev, user.userId]));
      setUser(null);
    } catch (err) {
      console.error("❌ Error adding user to chat:", err);
      setError("Error adding user.");
    }
  }, [user, currentUser.userId, existingChats]);

  const updateChatList = async (userRef, targetUser, chatId) => {
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const chatList = userData.chatList || [];

    const updatedChatList = chatList.map((chat) =>
      chat.chatId === chatId
        ? {
            ...chat,
            lastMessage: "New message",
            updatedAt: new Date(),
          }
        : chat
    );

    // ✅ If chat does not exist, add a new entry
    if (!updatedChatList.find((chat) => chat.chatId === chatId)) {
      updatedChatList.push({
        chatId,
        isSeen: false,
        lastMessage: "New message",
        receiverId: targetUser.userId,
        senderId: targetUser === currentUser ? user.userId : currentUser.userId,
        updatedAt: new Date(),
        userId: targetUser.userId,
        userName: targetUser.name,
      });
    }

    await updateDoc(userRef, { chatList: updatedChatList });
  };

  return (
    <div className={`addUser ${addMode ? "visible" : "hidden"}`}>
      <div className="header">
        <div className="topBar">
          <MdArrowBack onClick={() => setAddMode(!addMode)} />
          <p>New Chat</p>
        </div>
        <SearchBox
          input={searchInput}
          setInput={setSearchInput}
          onSubmit={handleSearch}
        />
      </div>

      {error && <p className="error">{error}</p>}

      {user && (
        <div className="user">
          <div className="addUser-detail">
            <img src={user.profilePic || "/avatar.png"} alt="User Avatar" />
            <span>{user.name || "Unknown User"}</span>
          </div>
          <button onClick={handleAdd} disabled={existingChats.has(user.userId)}>
            {existingChats.has(user.userId) ? "Already Added" : "Add User"}
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(AddUser);
