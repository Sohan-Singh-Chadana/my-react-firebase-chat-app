import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { uploadAvatar } from "./storage";
import { setUserOffline } from "../../hooks/useUserStatus";

// 🔥 Register User
export const registerUser = async (name, email, password, avatarFile) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    let profilePicUrl = "";
    if (avatarFile) {
      profilePicUrl = await uploadAvatar(avatarFile, user.uid);
    }

    const userData = {
      userId: user.uid,
      name,
      email,
      profilePic: profilePicUrl || "",
      status: "online",
      lastSeen: serverTimestamp(),
      chatList: [],
      blockedUsers: [],
    };

    await setDoc(doc(db, "users", user.uid), userData);
    await updateProfile(user, { displayName: name, photoURL: profilePicUrl });
    return user;
  } catch (error) {
    console.error("Registration Error:", error);
    throw error;
  }
};

// 🔥 Login User
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

// 🔥 Logout User
export const logoutUser = async () => {
  try {
    // Set user offline before signing out
    if (auth.currentUser?.uid) {
      console.log(auth.currentUser?.uid, "is logging out");
      await setUserOffline(auth.currentUser?.uid);
    }

    // Sign out the user
    await signOut(auth);

    console.log("✅ User logged out successfully");
  } catch (error) {
    console.error("❌ Logout Error:", error);
  }
};
