import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "../lib/firebase/firebase";
import useUserStore from "./userStore";
import useChatStore from "./chatStore";

const useMessageSelectionStore = create((set) => ({
  showCheckboxes: false,
  selectedMessages: [],
  isDeleteForEveryoneAllowed: true,
  isLoading: false,
  canDeleteForEveryone: false,

  // Show checkboxes
  showSelection: () => set({ showCheckboxes: true }),

  // Hide checkboxes
  hideSelection: () => set({ showCheckboxes: false }),

  // Select/Deselect messages
  selectMessage: (messageId) =>
    set((state) => ({
      selectedMessages: state.selectedMessages.includes(messageId)
        ? state.selectedMessages.filter((id) => id !== messageId) // Deselect if already selected
        : [...state.selectedMessages, messageId], // Select new message
    })),

  // Clear selection
  clearSelection: () => set({ selectedMessages: [] }),

  // 🔥 Check if all selected messages are from current user
  checkSenderForAllMessages: async () => {
    const { selectedMessages } = useMessageSelectionStore.getState();
    const { chatId } = useChatStore.getState();
    const { currentUser } = useUserStore.getState();

    if (!chatId || selectedMessages.length === 0) return;

    set({ isLoading: true }); // ✅ Start loading

    try {
      let allMessagesAreFromUser = true; // ✅ यह चेक करेगा कि सारे मैसेज currentUser के ही हैं

      for (const messageId of selectedMessages) {
        const messageRef = doc(db, "chats", chatId, "messages", messageId);
        const messageSnap = await getDoc(messageRef);

        if (messageSnap.exists()) {
          const messageData = messageSnap.data();

          if (messageData.senderId !== currentUser.uid) {
            allMessagesAreFromUser = false;
            break;
          }
        }
      }
      set({ canDeleteForEveryone: allMessagesAreFromUser });
    } catch (error) {
      console.error("Error checking sender:", error);
    } finally {
      set({ isLoading: false }); // ✅ Stop loading
    }
  },

  // 🔥 Delete for Me
  deleteForMe: async () => {
    const { selectedMessages } = useMessageSelectionStore.getState();
    const { chatId } = useChatStore.getState();
    const { currentUser } = useUserStore.getState();
    const userId = currentUser.uid;

    if (!userId || !chatId || selectedMessages.length === 0) return;

    try {
      await Promise.all(
        selectedMessages.map(async (messageId) => {
          const messageRef = doc(db, "chats", chatId, "messages", messageId);
          const messageSnap = await getDoc(messageRef);

          if (messageSnap.exists()) {
            const messageData = messageSnap.data();
            const updatedDeletedFor = [
              ...(messageData.deletedFor || []),
              userId,
            ];

            if (
              updatedDeletedFor.includes(messageData.senderId) &&
              updatedDeletedFor.includes(messageData.receiverId)
            ) {
              // 🔥 दोनों users ने delete कर दिया, अब message Firestore से हटाओ
              await deleteDoc(messageRef);
            } else {
              // 👤 सिर्फ एक user ने delete किया, तो updatedDeletedFor update करो
              await updateDoc(messageRef, { deletedFor: updatedDeletedFor });
            }
          }
        })
      );
      set({ selectedMessages: [] });
    } catch (error) {
      console.error("Delete for Me Error:", error);
    }
  },

  // 🔥 Delete for Everyone (24h limit)
  deleteForEveryone: async () => {
    const { selectedMessages } = useMessageSelectionStore.getState();
    const { chatId } = useChatStore.getState();
    const { currentUser } = useUserStore.getState();
    const userId = currentUser.uid;

    try {
      await Promise.all(
        selectedMessages.map(async (messageId) => {
          const messageRef = doc(db, "chats", chatId, "messages", messageId);
          const messageSnap = await getDoc(messageRef);

          if (messageSnap.exists()) {
            const messageData = messageSnap.data();
            const messageTime = messageData.timestamp;
            const currentTime = Date.now();

            // 🔥 Only sender can delete for everyone within 24 hours
            if (
              messageData.senderId === userId &&
              currentTime - messageTime.toMillis() <= 24 * 60 * 60 * 1000
            ) {
              await deleteDoc(messageRef);
            } else {
              console.log(
                "❌ Delete for everyone allowed only within 24 hours."
              );
            }
          }
        })
      );
      set({ selectedMessages: [] });
    } catch (error) {
      console.error("Delete for Everyone Error:", error);
    }
  },

  // 🔥 Check if "Delete for Everyone" is allowed (24-hour limit & sender-only)
  checkDeleteForEveryone: async () => {
    const { selectedMessages } = useMessageSelectionStore.getState();
    const { currentUser } = useUserStore.getState();
    const userId = currentUser.uid;

    if (!userId || selectedMessages.length === 0) return;

    try {
      const messageRef = doc(db, "messages", selectedMessages[0]);
      const messageSnap = await getDoc(messageRef);

      if (messageSnap.exists()) {
        const messageData = messageSnap.data();
        const messageTime = messageData.timestamp; // Firestore timestamp
        const currentTime = Date.now();

        // 🔥 Delete for Everyone is allowed only for sender & within 24 hours
        if (
          messageData.senderId === userId &&
          currentTime - messageTime.toMillis() > 24 * 60 * 60 * 1000
        ) {
          set({ isDeleteForEveryoneAllowed: true });
        } else {
          set({ isDeleteForEveryoneAllowed: false });
        }
      }
    } catch (error) {
      console.error("Error checking delete time:", error);
    }
  },
}));

export default useMessageSelectionStore;

//! 🚨 Important: This code is a simplified example and should be adapted to your specific use cas
// deleteForMe: async () => {
//   const { selectedMessages } = useMessageSelectionStore.getState();
//   const { chatId } = useChatStore.getState();
//   const { currentUser } = useUserStore.getState();
//   const userId = currentUser.uid;

//   if (!userId || !chatId || selectedMessages.length === 0) return;

//   try {
//     await Promise.all(
//       selectedMessages.map(async (messageId) => {
//         const messageRef = doc(db, "chats", chatId, "messages", messageId);
//         const messageSnap = await getDoc(messageRef);

//         if (messageSnap.exists()) {
//           const messageData = messageSnap.data();
//           await updateDoc(messageRef, {
//             deletedFor: [...(messageData.deletedFor || []), userId],
//           });
//         }
//       })
//     );
//     set({ selectedMessages: [] });
//   } catch (error) {
//     console.error("Delete for Me Error:", error);
//   }
// },
