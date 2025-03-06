import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../lib/firebase/firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useUserStore } from "../store";

// Get User Data
export async function getUserData(userId) {
  const userDoc = await getDoc(doc(db, "users", userId));
  return userDoc.exists() ? userDoc.data() : null;
}

// Update user profile
export const updateUserProfile = async (userId, data) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, data);

    useUserStore.setState((state) => ({
      ...state,
      currentUser: {
        ...state.currentUser,
        ...data,
      },
    }));

    console.log("✅ User profile updated successfully");
  } catch (err) {
    console.error("❌ Error updating user profile:", err);
    throw err;
  }
};

// Upload Profile Picture
export async function updateProfilePicture(userId, file) {
  if (!userId || !file) return;

  try {
    const storageRef = ref(storage, `avatars/${userId}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { profilePic: downloadURL });

    useUserStore.setState((state) => ({
      ...state,
      currentUser: { ...state.currentUser, profilePic: downloadURL },
    }));

    // console.log("Profile picture uploaded successfully!");
    return downloadURL;
  } catch (err) {
    console.error("Error updating profile picture:", err);
    throw err;
  }
}

// Delete Profile Picture
export async function deleteProfilePicture(userId) {
  if (!userId) return;

  try {
    const storageRef = ref(storage, `avatars/${userId}`);
    await deleteObject(storageRef);

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { profilePic: null });

    useUserStore.setState((state) => ({
      ...state,
      currentUser: { ...state.currentUser, profilePic: null },
    }));

    // console.log("✅ Profile picture deleted successfully");
  } catch (err) {
    console.error("Error deleting profile picture:", err);
  }
}
