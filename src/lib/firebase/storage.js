import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

export const uploadAvatar = async (file, userId) => {
  const avatarRef = ref(storage, `avatars/${userId}`);
  await uploadBytes(avatarRef, file);
  return await getDownloadURL(avatarRef);
};
