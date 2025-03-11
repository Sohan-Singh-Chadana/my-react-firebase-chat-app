import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase/firebase";

//* Fetch user data from Firestore
export const fetchUserData = async (receiverId) => {
  try {
    const userDocRef = doc(db, "users", receiverId);
    const userDocSnap = await getDoc(userDocRef);
    return userDocSnap.exists() ? userDocSnap.data() : null;
  } catch (err) {
    console.error("❌ [Error] Error fetching user data:", err);
    return null;
  }
};

//* Handle updates to the `deletedBy` array in chat data
export const handleDeletedByUpdates = async (
  chatData,
  chatsRef,
  currentUserId
) => {
  if (chatData.deletedBy?.includes(currentUserId)) {
    const updatedDeletedBy = chatData.deletedBy.filter(
      (id) => id !== currentUserId
    );
    if (updatedDeletedBy.length !== chatData.deletedBy.length) {
      await updateDoc(chatsRef, { deletedBy: updatedDeletedBy });
    }
  }
};

//* Listen for the last message in a chat //* Calculate unread messages count
export const listenForLastMessage = (
  chatId,
  setLastMessageData,
  currentUser
) => {
  const messagesRef = collection(db, "chats", chatId, "messages");

  const fetchLastValidMessage = async (limitCount = 10, lastDoc = null) => {
    let qLastMessage = query(
      messagesRef,
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );

    // If lastDoc exists, start after it (for pagination)
    if (lastDoc) {
      qLastMessage = query(
        messagesRef,
        orderBy("timestamp", "desc"),
        startAfter(lastDoc),
        limit(limitCount)
      );
    }

    const snapshot = await getDocs(qLastMessage);

    if (snapshot.empty) {
      setLastMessageData(chatId, null); // No messages at all
      return;
    }

    let lastVisibleMessage = null;
    let lastDocFetched = snapshot.docs[snapshot.docs.length - 1]; // Store last doc for pagination

    for (const doc of snapshot.docs) {
      const message = doc.data();

      // 🔥 Check if the message is deleted for the current user
      if (!message.deletedFor?.includes(currentUser?.userId)) {
        lastVisibleMessage = message;
        break; // Found a valid message, exit loop
      }
    }

    if (lastVisibleMessage) {
      setLastMessageData(chatId, lastVisibleMessage);
    } else {
      // 🚀 No valid message found in this batch, fetch more messages recursively
      fetchLastValidMessage(10, lastDocFetched);
    }
  };

  // Listen for message changes and fetch last valid message
  return onSnapshot(messagesRef, () => {
    fetchLastValidMessage();
  });
};

// export const listenForLastMessage = (
//   chatId,
//   setLastMessageData,
//   currentUser
// ) => {
//   const messagesRef = collection(db, "chats", chatId, "messages");

//   const fetchLastValidMessage = async (limit = 10, lastDoc = null) => {
//     let qLastMessage = query(
//       messagesRef,
//       orderBy("timestamp", "desc"),
//       limit(limit)
//     );

//     // If lastDoc exists, start after it (for pagination)
//     if (lastDoc) {
//       qLastMessage = query(
//         messagesRef,
//         orderBy("timestamp", "desc"),
//         limit(limit)
//       );
//     }

//     const snapshot = await getDocs(qLastMessage);

//     if (snapshot.empty) {
//       setLastMessageData(chatId, null);
//       return;
//     }

//     let lastVisibleMessage = null;
//     let lastDocFetched = snapshot.docs(snapshot.docs.length - 1);

//     for (const doc of snapshot.docs) {
//       const message = doc.data();

//       if (!message.deletedFor?.includes(currentUser?.userId)) {
//         lastVisibleMessage = message;
//         break;
//       }
//     }

//     if (lastVisibleMessage) {
//       setLastMessageData(chatId, lastVisibleMessage);
//     } else {
//       fetchLastValidMessage(10, lastDocFetched);
//     }
//   };

//   // Listen for message changes and fetch last valid message
//   return onSnapshot(messagesRef, () => {
//     fetchLastValidMessage();
//   });

//   // const qLastMessage = query(
//   //   messagesRef,
//   //   orderBy("timestamp", "desc"),
//   //   limit(10) // Fetch more messages in case some are deleted
//   // );

//   // return onSnapshot(qLastMessage, (snapshot) => {
//   //   if (!snapshot.empty) {
//   //     let lastVisibleMessage = null;

//   //     for (const doc of snapshot.docs) {
//   //       const message = doc.data();

//   //       // 🔥 Skip messages deleted for the current user
//   //       if (!message.deletedFor?.includes(currentUser?.userId)) {
//   //         lastVisibleMessage = message;
//   //         break; // Stop at the first valid message
//   //       }
//   //     }

//   //     setLastMessageData(chatId, lastVisibleMessage);
//   //   } else {
//   //     setLastMessageData(chatId, null);
//   //   }
//   // });
// };

//*  Sort chats by timestamp
export const sortChatsByTimestamp = (a, b) =>
  (b.updatedAt?.seconds ?? 0) - (a.updatedAt?.seconds ?? 0);
