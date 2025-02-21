import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useUserStore } from "../lib/userStore";
import { db } from "../lib/firebase/firebase";

export const updateUserStatus = async (userId, status) => {
  if (!userId) return;

  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, {
    status: status, // "online" or "offline"
    lastSeen: status === "offline" ? serverTimestamp() : null, // Last seen timestamp
  });
};

// // When user logs in
// export const setUserOnline = (userId) => updateUserStatus(userId, "online");

// // When user logs out or closes app
// export const setUserOffline = (userId) => updateUserStatus(userId, "offline");

// // Automatically set offline when user closes the window
// window.addEventListener("beforeunload", () => {
//   const userId = useUserStore.getState().currentUser.userId;
//   if (userId) setUserOffline(userId);
// });
