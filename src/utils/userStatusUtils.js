import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";

export const updateUserStatus = async (userId, status) => {
  if (!userId) return;

  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, {
    status: status, // "online" or "offline"
    lastSeen: status === "offline" ? serverTimestamp() : null, // Last seen timestamp
  });
};
