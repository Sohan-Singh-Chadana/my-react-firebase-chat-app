import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { create } from "zustand";
import { db, storage } from "../lib/firebase/firebase";
import useUserStore from "./userStore";
import useChatStore from "./chatStore";
import { extractStoragePath, updateLastMessageAfterDeletion } from "../utils";
import { deleteObject, ref } from "firebase/storage";
import { deleteMediaFiles } from "../utils/firebase/deleteMediaFiles/deleteMediaFiles";

const useMessageSelectionStore = create((set) => ({
  showCheckboxes: false,
  selectedMessages: [],
  isDeleteForEveryoneAllowed: true,
  isLoading: false,

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

  checkDeleteForEveryoneAndSender: async () => {
    const { selectedMessages } = useMessageSelectionStore.getState();
    const { currentUser } = useUserStore.getState();
    const { chatId } = useChatStore.getState();
    const userId = currentUser.uid;

    if (!userId || !chatId || selectedMessages.length === 0) return;

    // ✅ Start loading
    set({ isLoading: true });

    try {
      // yah check karega ki selectedMessages me sabhi messages user ke hi hain
      let allMessagesAreFromUser = true;
      // yah check karega ki message 24 hours se pehle send hua hua hai
      let allMessagesWithin24Hours = true;
      let allMessagesAreNotDeleted = true;

      const currentTime = Date.now();

      for (const messageId of selectedMessages) {
        const messageRef = doc(db, "chats", chatId, "messages", messageId);
        const messageSnap = await getDoc(messageRef);

        if (messageSnap.exists()) {
          const messageData = messageSnap.data();
          const messageTime = messageData.timestamp.toMillis();

          // ❌ If the message is already deleted, disable "Delete for Everyone"
          if (messageData.isDeleted) {
            allMessagesAreNotDeleted = false;
            break;
          }

          // agar koi message dusre user ka hai, to delete for everyone band kar do
          if (messageData.senderId !== userId) {
            allMessagesAreFromUser = false;
            break;
          }

          // agar koi message 24 ghante se purana hai, to delete for everyone band kar do
          if (currentTime - messageTime > 24 * 60 * 60 * 1000) {
            allMessagesWithin24Hours = false;
            break;
          }
        }
      }

      // ✅ "Delete for Everyone" only shows when:
      //    - Messages are from the user
      //    - Messages are within 24 hours
      //    - Messages are not already deleted
      set({
        isDeleteForEveryoneAllowed:
          allMessagesAreFromUser &&
          allMessagesWithin24Hours &&
          allMessagesAreNotDeleted,
      });
    } catch (error) {
      console.error("Error checking delete permissions:", error);
      set({ isDeleteForEveryoneAllowed: false });
    } finally {
      set({ isLoading: false });
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
              // ✅ Delete media if it exists (images, videos, docs)
              await deleteMediaFiles(messageData);

              // 🔥 दोनों users ने delete कर दिया, अब message Firestore से हटाओ
              await deleteDoc(messageRef);
            } else {
              // 👤 सिर्फ एक user ने delete किया, तो updatedDeletedFor update करो
              await updateDoc(messageRef, { deletedFor: updatedDeletedFor });
            }
          }
        })
      );

      // ✅ Sirf currentUser ka chatList update hoga
      await updateLastMessageAfterDeletion(chatId, true);

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
              // ✅ Delete media if it exists (images, videos, docs)
              await deleteMediaFiles(messageData);

              // await deleteDoc(messageRef);
              await updateDoc(messageRef, {
                text: "__deleted__",
                isDeleted: true, // ✅ Add flag to track deleted messages
                ...(messageData.media ? { media: null } : {}), // ✅ Null media only if it exists
                ...(messageData.docUrl ? { docUrl: null } : {}), // ✅ Null docUrl only if it exists
              });
            } else {
              console.log(
                "❌ Delete for everyone allowed only within 24 hours."
              );
            }
          }
        })
      );

      // ✅ Dono users ke chatList update honge
      await updateLastMessageAfterDeletion(chatId, false);

      set({ selectedMessages: [] });
    } catch (error) {
      console.error("Delete for Everyone Error:", error);
    }
  },
}));

export default useMessageSelectionStore;
