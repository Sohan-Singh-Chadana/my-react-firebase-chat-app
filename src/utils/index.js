// ✅ Fixing multiple named exports
export {
  fetchUserData,
  handleDeletedByUpdates,
  listenForLastMessage,
  sortChatsByTimestamp,
} from "./chatListUtils";

// ✅ Ensure chatDeletionUtils has a default export, otherwise change it to named exports
export * from "./chatDeletionUtils"; // ✅ Fix: Export all named functions

// ✅ Export chat deletion utilities
export * from "./deleteChatUtils";
export * from "./deletePhotoFromStorage";
export * from "./deleteSingleChat";

// ✅ Correct named exports for message, unread messages, and active users utils
export * from "./messageUtils";
export * from "./unreadMessagesUtils";
export * from "./activeUsersUtils";

// ✅ Profile & User utilities
export * from "./profilePictureUtils";
export * from "./profileUtils";
export * from "./userStatusUtils";

// ✅ Export date-related utilities
export * from "./dateUtils";
export * from "./updateLastMessageAfterDeletion";

export { default as upload } from "./upload";
export { default as getWallpaperColor } from "./getWallpaperColor";
export { default as showToast } from "./Notification/showToast";
export { default as showSuccessToast } from "./Notification/showSuccessToast";
export { default as showErrorToast } from "./Notification/showErrorToast";

