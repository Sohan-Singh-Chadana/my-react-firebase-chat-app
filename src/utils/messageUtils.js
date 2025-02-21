import {
  collection,
  getDocs,
  writeBatch,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase/firebase";
import { MdCheck, MdDoneAll } from "react-icons/md";
import React from "react";


export const listenForDeliveredMessages = (chatId, currentUserId) => {
  if (!chatId || !currentUserId) return;

  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(
    messagesRef,
    where("status", "==", "sent"),
    where("receiverId", "==", currentUserId)
  );

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const batch = writeBatch(db);
    snapshot.docChanges().forEach(({ type, doc }) => {
      if (type === "added") {
        batch.update(doc.ref, { status: "delivered" });
      }
    });
    await batch.commit();
  });

  return unsubscribe;
};

export const listenAndMarkMessagesAsRead = (chatId, currentUserId) => {
  if (!chatId || !currentUserId) return;

  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(
    messagesRef,
    where("status", "in", ["sent", "delivered"]),
    where("receiverId", "==", currentUserId)
  );

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const batch = writeBatch(db);
    snapshot.docChanges().forEach(({ type, doc }) => {
      if (type === "added") {
        batch.update(doc.ref, { status: "read" });
      }
    });
    await batch.commit();
  });

  return unsubscribe;
};

export const markMessagesAsDelivered = async (chatId, receiverId) => {
  if (!chatId || !receiverId) return;

  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(
    messagesRef,
    where("status", "==", "sent"),
    where("receiverId", "==", receiverId) // Only mark messages for the current user
  );

  try {
    const messagesSnap = await getDocs(q);

    if (messagesSnap.empty) {
      // console.log("No sent messages found to mark as delivered.");
      return;
    }

    const batch = writeBatch(db);
    messagesSnap.forEach((doc) => {
      batch.update(doc.ref, { status: "delivered" });
    });

    await batch.commit();
    // console.log("Messages marked as delivered successfully.");
  } catch (err) {
    console.error("Failed to mark messages as delivered:", err);
  }
};

export const markMessagesAsRead = async (chatId, receiverId) => {
  if (!chatId || !receiverId) return;

  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(
    messagesRef,
    where("status", "==", "delivered"),
    where("receiverId", "==", receiverId) // Only mark messages for the current user
  );

  try {
    const messagesSnap = await getDocs(q);

    if (messagesSnap.empty) {
      // console.log("No delivered messages found to mark as read.");
      return;
    }

    const batch = writeBatch(db);
    messagesSnap.forEach((doc) => {
      batch.update(doc.ref, { status: "read" });
    });

    await batch.commit();
    // console.log("Messages marked as read successfully.");
  } catch (err) {
    console.error("Failed to mark messages as read:", err);
  }
};

// ✅ Mark all existing messages as delivered when the app is open and the user is online
export const markAllMessagesAsDelivered = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const chatList = userSnap.data()?.chatList || [];

    for (const chat of chatList) {
      await markMessagesAsDelivered(chat.chatId, userId);
      // console.log("✅ Messages marked as delivered for chat:", chat.chatId);
    }
  } catch (error) {
    console.error("❌ Failed to mark messages as delivered:", error);
  }
};

// ✅ Listen for new messages in real-time **for each chat the user is a part of**
export const listenForNewMessages = async (userId) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  const chatList = userSnap.data()?.chatList || [];

  let chatListeners = [];

  chatList.forEach((chat) => {
    const messagesRef = collection(db, "chats", chat.chatId, "messages");
    const q = query(messagesRef, where("status", "==", "sent"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (!snapshot.empty) {
        // console.log("🔄 New messages detected in chat:", chat.chatId);
        await markMessagesAsDelivered(chat.chatId, userId);
      }
    });

    chatListeners.push(unsubscribe);
  });

  // ✅ Return an array of unsubscribe functions to clean up later
  return chatListeners;
};


export const markAndListenForDeliveredMessages = async (userId) => {
  try {
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("participants", "array-contains", userId));
    const chatsSnap = await getDocs(q);

    if (chatsSnap.empty) return null;

    const batch = writeBatch(db);
    let unsubscribes = [];

    // Loop through all chats
    for (const chatDoc of chatsSnap.docs) {
      const messagesRef = collection(db, "chats", chatDoc.id, "messages");

      // ✅ Mark existing "sent" messages as "delivered"
      const messagesSnap = await getDocs(
        query(messagesRef, where("status", "==", "sent"))
      );
      messagesSnap.forEach((doc) => {
        batch.update(doc.ref, { status: "delivered" });
      });

      // ✅ Listen for new "sent" messages and mark them as "delivered"
      const unsubscribe = onSnapshot(
        query(messagesRef, where("status", "==", "sent")),
        async (snapshot) => {
          if (snapshot.empty) return;

          const liveBatch = writeBatch(db);
          snapshot.docs.forEach((doc) => {
            liveBatch.update(doc.ref, { status: "delivered" });
          });

          await liveBatch.commit();
        }
      );

      // 🔥 Store all unsubscribe functions
      unsubscribes.push(unsubscribe);
    }

    await batch.commit();

    // ✅ Return a function that unsubscribes all listeners
    return () => unsubscribes.forEach((unsub) => unsub());
  } catch (err) {
    console.error(
      "Failed to mark messages as delivered and listen for new messages:",
      err
    );
    return null;
  }
};

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
