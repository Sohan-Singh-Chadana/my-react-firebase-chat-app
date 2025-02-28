import { useRef, useState } from "react";
import { deleteProfilePicture, updateProfilePicture } from "../services/userService";
import { toast } from "react-toastify";

export const useProfilePicture = (currentUser) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const avatarRef = useRef(null);
  const avatarPreviewRef = useRef(null);
  const profilePrvBoxRef = useRef(null);

  const handleMenuOpen = (event) => {
    const parentRect = event.currentTarget.getBoundingClientRect();
    const { clientX, clientY } = event;

    setMenuPosition({
      top: clientY - parentRect.top + 10,
      left: clientX - parentRect.left + 10,
    });

    setMenuOpen((prev) => !prev);
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar({
        file,
        url: URL.createObjectURL(file),
      });
    }
  };

  const handleAvatarChange = async () => {
    if (!avatar.file) return;

    try {
      setIsLoading(true);
      await updateProfilePicture(currentUser.userId, avatar.file);
      toast.success("Profile picture updated successfully");
      closeProfileMenu();
    } catch (error) {
      console.error("❌ Error updating profile picture:", error);
    } finally {
      setIsLoading(false); // 🔹 Stop loading
    }
  };

  const closeProfileMenu = () => {
    setAvatar({ file: null, url: "" });

    // ✅ Reset the input field to allow selecting the same image again
    const fileInput = document.getElementById("profile-pic");
    if (fileInput) fileInput.value = "";
  };

  const uploadAvatar = () => {
    const fileInput = document.getElementById("profile-pic");
    if (fileInput) {
      fileInput.click();
      setMenuOpen(false);
    }
  };

  const clearAvatar = () => setShowConfirm(true);

  const cancelClearAvatar = () => setShowConfirm(false);

  const confirmClearAvatar = async () => {
    try {
      setIsLoading(true);
      await deleteProfilePicture(currentUser?.userId);
      setAvatar({
        file: null,
        url: "",
      });
      setShowConfirm(false);
      toast.success("Profile picture removed successfully");
    } catch (err) {
      console.error("❌ Error deleting profile picture:", err);
    } finally {
      setIsLoading(false);
    }
  };
  return {
    menuOpen,
    setMenuOpen,
    showConfirm,
    isLoading,
    menuPosition,
    avatar,
    avatarRef,
    avatarPreviewRef,
    profilePrvBoxRef,
    handleMenuOpen,
    handleImagePreview,
    handleAvatarChange,
    closeProfileMenu,
    uploadAvatar,
    clearAvatar,
    cancelClearAvatar,
    confirmClearAvatar,
  };
};
