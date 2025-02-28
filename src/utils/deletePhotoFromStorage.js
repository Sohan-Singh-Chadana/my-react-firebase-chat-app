import { deleteObject, ref } from "firebase/storage";
import { storage } from "../lib/firebase/firebase";

// ✅ Function to delete photo from Firebase Storage
export const deletePhotoFromStorage = async (imgUrl) => {
  try {
    const imgRef = ref(storage, imgUrl); // ✅ Firebase Storage se reference lo
    await deleteObject(imgRef); // ✅ Image delete karo
    console.log("✅ Image deleted from storage:", imgUrl);
  } catch (err) {
    console.error("❌ Error deleting image:", err);
  }
};
