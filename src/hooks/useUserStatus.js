import {
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase/firebase";

export const listenToUserStatus = (userId, setUserStatus) => {
  if (!userId) return () => {};

  const userRef = doc(db, "users", userId);

  const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      setUserStatus({
        status: userData.status || "offline", // Default to "offline" if status is not set
        lastSeen: userData.lastSeen?.toDate() || null, // Convert Firestore timestamp to JavaScript Date
      });
    }
  });

  return unsubscribe;
};

export const setUserOnline = async (userId) => {
  if (!userId) return;

  try {
    await updateDoc(doc(db, "users", userId), {
      status: "online",
      lastSeen: serverTimestamp(),
    });
    // console.log(`✅ User ${userId} is now online`);
  } catch (err) {
    console.error("❌ Error setting user online:", err);
  }
};

export const setUserOffline = async (userId) => {
  if (!userId) return;

  try {
    await updateDoc(doc(db, "users", userId), {
      status: "offline",
      lastSeen: serverTimestamp(),
    });
    // console.log(`✅ User ${userId} is now offline`);
  } catch (err) {
    console.error("❌ Error setting user offline:", err);
  }
};
