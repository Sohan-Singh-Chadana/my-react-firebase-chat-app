import { toast } from "react-toastify";
import { updateUserProfile } from "../lib/userService";

export const handleProfileUpdate = async ({
  field,
  value,
  setIsLoading,
  setEditMode,
  currentUser,
}) => {
  try {
    if (!value || value.trim() === "") {
      toast.warn(
        `❌ ${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty!`
      );
      return;
    }

    if (field === "name") setIsLoading(true);
    if (field === "about") setIsLoading(true);

    await updateUserProfile(currentUser?.userId, { [field]: value.trim() });

    toast.success("Profile updated successfully!");
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  } catch (error) {
    console.error(`❌ Failed to update ${field}:`, error);
  } finally {
    if (field === "name") setIsLoading(false);
    if (field === "about") setIsLoading(false);
  }
};
