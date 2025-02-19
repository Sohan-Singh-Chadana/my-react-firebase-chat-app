import {
  collection,
  doc,
  getDocs,
  increment,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase/firebase";

export const listenForNewMessages = (userId) => {
  const chatsRef = collection(db, "chats");

  const q = query(chatsRef, where("participants", "array-contains", userId));

  return onSnapshot(q, async (snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === "modified") {
        const chatId = change.doc.id;
        const chatData = change.doc.data();

        // नया मैसेज आया है, और unreadCount बढ़ाना है
        const messagesRef = collection(db, "chats", chatId, "messages");
        const unreadMessagesQuery = query(
          messagesRef,
          where("receiverId", "==", userId),
          where("status", "==", "sent")
        );

        onSnapshot(unreadMessagesQuery, async (msgSnapshot) => {
          if (!msgSnapshot.empty) {
            // unreadCount बढ़ाएं
            const chatRef = doc(db, "chats", chatId);
            await updateDoc(chatRef, {
              updatedAt: new Date(), // चैट को टॉप पर लाने के लिए
            });

            // user के chatList में अपडेट करें
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
              chatList: increment(1), // unreadCount को user की chatList में स्टोर करें
            });
          }
        });
      }
    });
  });
};

export const moveChatToTop = async (chatId) => {
  const chatRef = doc(db, "chats", chatId);

  try {
    await updateDoc(chatRef, {
      updatedAt: new Date(), // updatedAt अपडेट करें
    });
  } catch (error) {
    console.error("Error moving chat to top:", error);
  }
};

export const resetUnreadCount = async (chatId, userId) => {
  const chatRef = doc(db, "chats", chatId);
  const userRef = doc(db, "users", userId);

  try {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const unreadMessagesQuery = query(
      messagesRef,
      where("receiverId", "==", userId),
      where("status", "==", "sent")
    );
    const msgSnapshot = await getDocs(unreadMessagesQuery);
    msgSnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, {
        status: "read",
      });
    });

    await updateDoc(chatRef, {
      updatedAt: new Date(),
    });

    await updateDoc(userRef, {
      chatList: increment(-msgSnapshot.size), // unreadCount घटाएँ
    });
  } catch (error) {
    console.error("Error resetting unread count:", error);
  }
};
