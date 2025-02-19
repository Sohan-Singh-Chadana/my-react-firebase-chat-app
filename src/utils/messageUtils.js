import {
  collection,
  getDocs,
  writeBatch,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase/firebase";
import { MdCheck, MdDoneAll } from "react-icons/md";
import React from "react";

// Helper function to mark messages with the given status
const updateMessageStatus = async (chatId, status, targetStatus) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, where("status", "==", status));

  try {
    const messagesSnap = await getDocs(q);

    if (messagesSnap.empty) {
      console.log(`No ${status} messages found in the chat.`);
      return;
    }

    const batch = writeBatch(db);

    messagesSnap.forEach((doc) => {
      batch.update(doc.ref, { status: targetStatus });
    });

    await batch.commit();
    console.log(`${status} messages marked as ${targetStatus} successfully`);
  } catch (err) {
    console.error(`Failed to update messages to ${targetStatus}:`, err);
  }
};

// ✅ Automatically mark incoming messages as "delivered" (even if the chat is not open)
export const listenForDeliveredMessages = (chatId) => {
  if (!chatId) return;

  console.log("🔔 Listening for new messages to mark as delivered...");

  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, where("status", "==", "sent"));

  // Listen for new messages and mark them as delivered
  const unsubscribe = onSnapshot(q, async (snapshot) => {
    if (snapshot.empty) return;

    const batch = writeBatch(db);

    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { status: "delivered" });
    });

    try {
      await batch.commit();
      console.log("✅ New messages marked as delivered!");
    } catch (err) {
      console.error("❌ Failed to mark messages as delivered:", err);
    }
  });

  return unsubscribe; // Call this when the chat is deselected to stop listening
};

// ✅ Mark messages as "read" when chat is open
export const listenAndMarkMessagesAsRead = (chatId, receiverId) => {
  if (!chatId || !receiverId) return;

  console.log("👀 Listening to mark messages as read...");

  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, where("status", "==", "delivered"));

  // Listen for "delivered" messages and mark them as "read" in real-time
  const unsubscribe = onSnapshot(q, async (snapshot) => {
    if (snapshot.empty) return;

    const batch = writeBatch(db);

    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { status: "read" });
    });

    try {
      await batch.commit();
      console.log("✅ Messages marked as read!");
    } catch (err) {
      console.error("❌ Failed to mark messages as read:", err);
    }
  });

  return unsubscribe; // Call this when the chat is deselected to stop listening
};

// ✅ Manually mark messages as "delivered"
export const markMessagesAsDelivered = async (chatId) => {
  await updateMessageStatus(chatId, "sent", "delivered");
};

// ✅ Manually mark messages as "read"
export const markMessagesAsRead = async (receiverId, chatId) => {
  await updateMessageStatus(chatId, "delivered", "read");
};

// // Helper function to mark messages with the given status
// const updateMessageStatus = async (chatId, status, targetStatus) => {
//   const messagesRef = collection(db, "chats", chatId, "messages");
//   const messagesSnap = await getDocs(messagesRef);

//   if (messagesSnap.empty) {
//     console.log("No messages found in the chat.");
//     return;
//   }

//   const batch = writeBatch(db);

//   messagesSnap.forEach((doc) => {
//     const message = doc.data();
//     if (message.status === status) {
//       batch.update(doc.ref, { status: targetStatus });
//     }
//   });

//   try {
//     await batch.commit();
//     // console.log(`${targetStatus} messages marked successfully`);
//   } catch (err) {
//     console.error(`Failed to update messages to ${targetStatus}:`, err);
//   }
// };

// // Mark messages as delivered
// export const markMessagesAsDelivered = async (chatId) => {
//   await updateMessageStatus(chatId, "sent", "delivered");
// };

// // Mark messages as read
// export const markMessagesAsRead = async (receiverId, chatId) => {
//   await updateMessageStatus(chatId, "delivered", "read");
// };

// // Listen for new messages and mark them as "read" when chat is selected
// export const listenAndMarkMessagesAsRead = (chatId, receiverId) => {
//   if (!chatId || !receiverId) return;

//   console.log("listenAndMarkMessagesAsRead function call")

//   const messagesRef = collection(db, "chats", chatId, "messages");
//   const q = query(messagesRef, where("status", "==", "delivered"));

//   const unsubscribe = onSnapshot(q, async (snapshot) => {
//     if (snapshot.empty) return;

//     const batch = writeBatch(db);

//     snapshot.docs.forEach((doc) => {
//       batch.update(doc.ref, { status: "read" });
//     });

//     try {
//       await batch.commit();
//     } catch (err) {
//       console.error("Failed to mark messages as read:", err);
//     }
//   });

//   return unsubscribe; // Call this when the chat is deselected to stop listening
// };

export const getStatusIcon = (message) => {
  switch (message.status) {
    case "sent":
      return MdCheck; // Return component reference
    case "delivered":
      return MdDoneAll;
    case "read":
      // eslint-disable-next-line react/display-name
      return (props) =>
        React.createElement(MdDoneAll, {
          ...props,
          style: { color: "#66b7dc" },
        });
    default:
      return null;
  }
};
