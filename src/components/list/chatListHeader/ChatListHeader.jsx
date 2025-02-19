import { useState, useEffect, useRef } from "react";
import { MdClose, MdOutlineChat } from "react-icons/md";
import useGlobalStateStore from "../../../lib/globalStateStore";
import MenuContainer from "../../common/menuContainer/MenuContainer";
import SearchBox from "../../common/searchBox/SearchBox";
import Modal from "../../common/modal/Modal";
import "./chatListHeader.css";
import useSelectChats from "../../../lib/selectChats";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";

import { useUserStore } from "../../../lib/userStore";
import { db, storage } from "../../../lib/firebase/firebase";
import { logoutUser } from "../../../lib/firebase/auth";
import { deleteObject, ref } from "firebase/storage";
import { useChatStore } from "../../../lib/chatStore";

const ChatListHeader = () => {
  const {
    addMode,
    setAddMode,
    selectMode,
    setSelectMode,
    searchInput,
    setSearchInput,
  } = useGlobalStateStore();
  const { selectedChats, clearSelectedChats, chats, setChats } =
    useSelectChats();
  const { currentUser } = useUserStore();
  const { resetChatId } = useChatStore.getState();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const menuRef = useRef(null);

  // Logout function with confirmation
  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    logoutUser();
    setShowConfirm(false);
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  // Toggle chat selection mode
  const handleSelectChats = () => {
    setSelectMode(!selectMode);
    setMenuOpen(false); // Close menu after selecting
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // const handleDeleteChats = async () => {
  //   if (selectedChats.length === 0) return;

  //   try {
  //     const batch = writeBatch(db);

  //     // ✅ Current user ki chatList update karna
  //     const userRef = doc(db, "users", currentUser.userId);
  //     const userSnap = await getDoc(userRef);

  //     if (!userSnap.exists()) return;

  //     const currentChatList = userSnap.data().chatList || [];

  //     // ✅ ChatList se selected chats hatao
  //     const updatedChatList = currentChatList.filter(
  //       (chat) =>
  //         !selectedChats.some(
  //           (selectedChat) => selectedChat.chatId === chat.chatId
  //         )
  //     );

  //     batch.update(userRef, { chatList: updatedChatList });

  //     for (const selectedChat of selectedChats) {
  //       const chatRef = doc(db, "chats", selectedChat.chatId);
  //       const messagesRef = collection(
  //         db,
  //         "chats",
  //         selectedChat.chatId,
  //         "messages"
  //       );
  //       const chatSnap = await getDoc(chatRef);

  //       if (chatSnap.exists()) {
  //         const chatData = chatSnap.data();
  //         const deletedBy = chatData.deletedBy || [];
  //         const updatedDeletedBy = [
  //           ...new Set([...deletedBy, currentUser.userId]),
  //         ];

  //         if (
  //           updatedDeletedBy.includes(currentUser.userId) &&
  //           updatedDeletedBy.includes(selectedChat.receiverId)
  //         ) {
  //           // ✅ Agar dono ne delete kiya, toh pura chat aur messages delete karo
  //           const messageDocs = await getDocs(messagesRef);
  //           messageDocs.forEach((doc) => batch.delete(doc.ref)); // Delete all messages

  //           batch.delete(chatRef); // Delete chat after messages
  //         } else {
  //           // ✅ Sirf ek user delete kare to `deletedBy` update karo
  //           batch.update(chatRef, { deletedBy: updatedDeletedBy });
  //         }
  //       }
  //     }

  //     await batch.commit(); // ✅ Batch update commit karo

  //     // ✅ Zustand state update karein
  //     setChats((state) => ({
  //       chats: state.chats.filter(
  //         (chat) =>
  //           !selectedChats.some(
  //             (selectedChat) => selectedChat.chatId === chat.chatId
  //           )
  //       ),
  //     }));

  //     // ✅ Chat delete hone ke baad Home dikhane ke liye `chatId` reset karo
  //     resetChatId();
  //     clearSelectedChats();
  //     setConfirmDelete(false);
  //     setSelectMode(false);
  //   } catch (err) {
  //     console.error("❌ Error deleting chats:", err);
  //   }
  // };

  // ! main
  // const handleDeleteChats = async () => {
  //   if (selectedChats.length === 0) return;

  //   try {
  //     const batch = writeBatch(db);

  //     // ✅ Update current user's chatList
  //     const userRef = doc(db, "users", currentUser.userId);
  //     const userSnap = await getDoc(userRef);

  //     if (!userSnap.exists()) return;

  //     const currentChatList = userSnap.data().chatList || [];

  //     // ✅ Remove selected chats from chatList
  //     const updatedChatList = currentChatList.filter(
  //       (chat) =>
  //         !selectedChats.some(
  //           (selectedChat) => selectedChat.chatId === chat.chatId
  //         )
  //     );

  //     batch.update(userRef, { chatList: updatedChatList });

  //     for (const selectedChat of selectedChats) {
  //       const chatRef = doc(db, "chats", selectedChat.chatId);
  //       const messagesRef = collection(
  //         db,
  //         "chats",
  //         selectedChat.chatId,
  //         "messages"
  //       );
  //       const chatSnap = await getDoc(chatRef);

  //       if (chatSnap.exists()) {
  //         const chatData = chatSnap.data();
  //         const deletedBy = chatData.deletedBy || [];
  //         const updatedDeletedBy = [
  //           ...new Set([...deletedBy, currentUser.userId]),
  //         ];

  //         // Update the deletedBy field for each message in the chat
  //         const messagesSnap = await getDocs(messagesRef);
  //         messagesSnap.forEach((msgDoc) => {
  //           batch.update(doc(db, "chats", selectedChat.chatId, "messages", msgDoc.id), {
  //             deletedBy: updatedDeletedBy,
  //           });
  //         });

  //         if (
  //           updatedDeletedBy.includes(currentUser.userId) &&
  //           updatedDeletedBy.includes(selectedChat.receiverId)
  //         ) {
  //           // Both users have deleted, so delete the entire chat and messages
  //           await deleteChatWithMessages(chatRef, messagesRef);
  //         } else {
  //           // Only one user has deleted the chat, so just update the deletedBy field
  //           batch.update(chatRef, { deletedBy: updatedDeletedBy });
  //         }
  //       }
  //     }

  //     await batch.commit(); // Commit the batch

  //     // Update the Zustand state
  //     setChats((state) => ({
  //       chats: state.chats.filter(
  //         (chat) =>
  //           !selectedChats.some(
  //             (selectedChat) => selectedChat.chatId === chat.chatId
  //           )
  //       ),
  //     }));

  //     resetChatId();
  //     clearSelectedChats();
  //     setConfirmDelete(false);
  //     setSelectMode(false);
  //   } catch (err) {
  //     console.error("❌ Error deleting chats:", err);
  //   }
  // };

  // ✅ Function to delete all messages + photos inside a chat

  // const handleDeleteChats = async () => {
  //   if (selectedChats.length === 0) return;

  //   try {
  //     const batch = writeBatch(db);

  //     // ✅ Get current user's chatList
  //     const userRef = doc(db, "users", currentUser.userId);
  //     const userSnap = await getDoc(userRef);

  //     if (!userSnap.exists()) {
  //       console.warn("⚠️ [User] User document not found:", currentUser.userId);
  //       return;
  //     }

  //     const currentChatList = userSnap.data().chatList || [];

  //     // ✅ Remove selected chats from chatList
  //     const updatedChatList = currentChatList.filter(
  //       (chat) => !selectedChats.some((selectedChat) => selectedChat.chatId === chat.chatId)
  //     );

  //     batch.update(userRef, { chatList: updatedChatList });

  //     for (const selectedChat of selectedChats) {
  //       const chatRef = doc(db, "chats", selectedChat.chatId);
  //       const messagesRef = collection(db, "chats", selectedChat.chatId, "messages");

  //       const chatSnap = await getDoc(chatRef);

  //       if (!chatSnap.exists()) {
  //         console.warn("⚠️ [Chat] Chat document not found, skipping:", selectedChat.chatId);
  //         continue; // ✅ Skip this chat since it does not exist
  //       }

  //       const chatData = chatSnap.data();
  //       const deletedBy = chatData.deletedBy || [];
  //       const updatedDeletedBy = [...new Set([...deletedBy, currentUser.userId])];

  //       // ✅ Check if messages exist before updating
  //       const messagesSnap = await getDocs(messagesRef);

  //       messagesSnap.forEach((msgDoc) => {
  //         if (!msgDoc.exists()) {
  //           console.warn("⚠️ [Message] Skipping missing message:", msgDoc.id);
  //           return;
  //         }

  //         batch.update(doc(db, "chats", selectedChat.chatId, "messages", msgDoc.id), {
  //           deletedBy: updatedDeletedBy,
  //         });
  //       });

  //       // ✅ Update deletedAt timestamp
  //       const updatedDeletedAt = {
  //         ...(chatData.deletedAt || {}),
  //         [currentUser.userId]: serverTimestamp(),
  //       };

  //       // ✅ If the chat document still exists, update it
  //       if ((await getDoc(chatRef)).exists()) {
  //         batch.update(chatRef, {
  //           deletedBy: updatedDeletedBy,
  //           deletedAt: updatedDeletedAt,
  //         });
  //       }

  //       // ✅ If both users deleted the chat, delete it
  //       if (updatedDeletedBy.includes(currentUser.userId) && updatedDeletedBy.includes(selectedChat.receiverId)) {
  //         await deleteChatWithMessages(chatRef, messagesRef);
  //       }
  //     }

  //     await batch.commit(); // Commit batch update

  //     // ✅ Update Zustand state
  //     setChats((state) => ({
  //       chats: state.chats.filter(
  //         (chat) => !selectedChats.some((selectedChat) => selectedChat.chatId === chat.chatId)
  //       ),
  //     }));

  //     resetChatId();
  //     clearSelectedChats();
  //     setConfirmDelete(false);
  //     setSelectMode(false);
  //   } catch (err) {
  //     console.error("❌ [Error] Failed to delete chats:", err);
  //   }
  // };

  // const deleteChatWithMessages = async (chatRef, messagesRef) => {
  //   const messagesSnap = await getDocs(messagesRef);
  //   const batch = writeBatch(db);

  //   for (const message of messagesSnap.docs) {
  //     const messageData = message.data();
  //     if (messageData.img) {
  //       // ✅ Agar message ke saath photo hai toh Firebase Storage se delete karo
  //       await deletePhotoFromStorage(messageData.img);
  //     }
  //     batch.delete(message.ref); // ✅ Messages delete karo
  //   }

  //   batch.delete(chatRef); // ✅ Chat document bhi delete karo
  //   await batch.commit();
  // };

  const handleDeleteChats = async () => {
    if (selectedChats.length === 0) return;

    try {
      const batch = writeBatch(db);

      // ✅ Get current user's chatList
      const userRef = doc(db, "users", currentUser.userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.warn("⚠️ [User] User document not found:", currentUser.userId);
        return;
      }

      const currentChatList = userSnap.data().chatList || [];

      // ✅ Remove selected chats from chatList
      const updatedChatList = currentChatList.filter(
        (chat) =>
          !selectedChats.some(
            (selectedChat) => selectedChat.chatId === chat.chatId
          )
      );

      batch.update(userRef, { chatList: updatedChatList });

      for (const selectedChat of selectedChats) {
        const chatRef = doc(db, "chats", selectedChat.chatId);
        const messagesRef = collection(
          db,
          "chats",
          selectedChat.chatId,
          "messages"
        );

        const chatSnap = await getDoc(chatRef);

        if (!chatSnap.exists()) {
          console.warn(
            "⚠️ [Chat] Chat document not found, skipping:",
            selectedChat.chatId
          );
          continue; // ✅ Skip this chat since it does not exist
        }

        const chatData = chatSnap.data();
        const deletedBy = chatData.deletedBy || [];
        const updatedDeletedBy = [
          ...new Set([...deletedBy, currentUser.userId]),
        ];

        // ✅ Check if messages exist before updating
        const messagesSnap = await getDocs(messagesRef);

        messagesSnap.forEach((msgDoc) => {
          if (!msgDoc.exists()) {
            console.warn("⚠️ [Message] Skipping missing message:", msgDoc.id);
            return;
          }

          batch.update(
            doc(db, "chats", selectedChat.chatId, "messages", msgDoc.id),
            {
              deletedBy: updatedDeletedBy,
            }
          );
        });

        // ✅ Update deletedAt timestamp
        const updatedDeletedAt = {
          ...(chatData.deletedAt || {}),
          [currentUser.userId]: serverTimestamp(),
        };

        // ✅ Update chat document with the new deletion status
        batch.update(chatRef, {
          deletedBy: updatedDeletedBy,
          deletedAt: updatedDeletedAt,
        });

        // ✅ If both users deleted the chat, delete it
        if (
          updatedDeletedBy.includes(currentUser.userId) &&
          updatedDeletedBy.includes(selectedChat.receiverId)
        ) {
          await deleteChatWithMessages(chatRef, messagesRef, batch);
        }
      }

      await batch.commit(); // Commit batch update

      // ✅ Update Zustand state
      setChats((state) => ({
        chats: state.chats.filter(
          (chat) =>
            !selectedChats.some(
              (selectedChat) => selectedChat.chatId === chat.chatId
            )
        ),
      }));

      resetChatId();
      clearSelectedChats();
      setConfirmDelete(false);
      setSelectMode(false);
    } catch (err) {
      console.error("❌ [Error] Failed to delete chats:", err);
    }
  };

  const deleteChatWithMessages = async (chatRef, messagesRef, batch) => {
    const messagesSnap = await getDocs(messagesRef);

    for (const message of messagesSnap.docs) {
      const messageData = message.data();
      if (messageData.img) {
        // ✅ If the message has an image, delete it from Firebase Storage
        await deletePhotoFromStorage(messageData.img);
      }
      batch.delete(message.ref); // ✅ Delete the message
    }

    batch.delete(chatRef); // ✅ Delete the chat document
  };

  // ✅ Function to delete photo from Firebase Storage
  const deletePhotoFromStorage = async (imgUrl) => {
    try {
      const imgRef = ref(storage, imgUrl); // ✅ Firebase Storage se reference lo
      await deleteObject(imgRef); // ✅ Image delete karo
      console.log("✅ Image deleted from storage:", imgUrl);
    } catch (err) {
      console.error("❌ Error deleting image:", err);
    }
  };

  const handleCancelSelect = () => {
    clearSelectedChats();
    setSelectMode(false);
  };

  return (
    <div className="chatList-header">
      <div className="header">
        <h2 className="title">Chats</h2>
        <div className="icons">
          <MdOutlineChat onClick={() => setAddMode(!addMode)} />

          {/* More button with dropdown */}
          <MenuContainer
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            menuRef={menuRef}
          >
            <button onClick={handleLogout}>Log out</button>
            <button>Profile</button>
            <button onClick={handleSelectChats}>
              {selectMode ? "Cancel Select" : "Select Chats"}
            </button>
          </MenuContainer>
        </div>
      </div>

      {!selectMode && (
        <>
          <div className="search-container">
            <SearchBox input={searchInput} setInput={setSearchInput} />
          </div>

          <div className="filters">
            <button className="active">All</button>
            <button>Unread</button>
            <button>Favorites</button>
            <button>Groups</button>
          </div>
        </>
      )}

      {/* Select Mode Header */}
      {selectMode && (
        <div className="select-header">
          <div className="select-info">
            <MdClose onClick={handleCancelSelect} />
            <span>{selectedChats.length} Selected</span>
          </div>
          <div className="select-actions">
            {selectedChats.length > 0 && (
              <>
                <button onClick={() => setConfirmDelete(true)}>Delete</button>
                <button onClick={handleCancelSelect}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <Modal
          isOpen={showConfirm}
          onClose={cancelLogout}
          onConfirm={confirmLogout}
          title="Log out?"
          description="Are you sure you want to log out? This will end your current session."
          confirmText="Log out"
          cancelText="Cancel"
        />
      )}

      {/* Confirmation Modal */}
      {confirmDelete && (
        <Modal
          isOpen={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          onConfirm={handleDeleteChats}
          title="Delete Chats?"
          description="Are you sure you want to delete selected chats?"
          confirmText="Yes, Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default ChatListHeader;
