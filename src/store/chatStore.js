import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db, storage } from "../lib/firebase/firebase";
import { create } from "zustand";
import useUserStore from "./userStore";
import { extractStoragePath } from "../utils";
import { deleteObject, ref } from "firebase/storage";

const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,

  // ✅ Chat reset function
  resetChatId: () => {
    set({
      chatId: null,
      user: null,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
    });
  },

  changeChat: async (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;

    if (!chatId || !user) {
      console.error("❌ Error: chatId or user is undefined", { chatId, user });
      return;
    }

    if (!currentUser || !currentUser.userId) {
      console.error("⛔ Current user data is missing in changeChat function!");
      return;
    }

    try {
      // ✅ Firestore से latest user data लाना (blocking check के लिए)
      const userDocRef = doc(db, "users", currentUser.userId);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        console.error("⛔ Current user not found in Firestore!");
        return;
      }

      const currentUserData = userDocSnap.data();
      const currentUserBlockedUsers = Array.isArray(
        currentUserData.blockedUsers
      )
        ? currentUserData.blockedUsers
        : [];

      const userBlockedUsers = Array.isArray(user.blockedUsers)
        ? user.blockedUsers
        : [];

      // ✅ Check if current user is blocked by the receiver
      if (userBlockedUsers.includes(currentUser.userId)) {
        set({
          chatId,
          user: null,
          isCurrentUserBlocked: true,
          isReceiverBlocked: false,
        });
        console.warn(`⛔ You are blocked by ${user.name}`);
        return;
      }

      // ✅ Check if receiver is blocked by the current user
      if (currentUserBlockedUsers.includes(user.userId)) {
        set({
          chatId,
          user,
          isCurrentUserBlocked: false,
          isReceiverBlocked: true,
        });
        console.warn(`⛔ You have blocked ${user.name}`);
        return;
      }

      // ✅ Default case (chat allowed)
      set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      });
    } catch (error) {
      console.error("❌ Error in changeChat:", error);
    }
  },

  changeBlock: () => {
    set((state) => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }));
  },

  clearChatForMe: async () => {
    const { chatId } = useChatStore.getState();
    const { currentUser } = useUserStore.getState();
    const userId = currentUser.uid;

    if (!userId || !chatId) return;

    try {
      const messagesRef = collection(db, "chats", chatId, "messages");
      const messagesSnap = await getDocs(messagesRef);

      const batch = writeBatch(db);
      const imagesToDelete = [];

      messagesSnap.forEach((docSnap) => {
        const messageData = docSnap.data();
        const messageRef = doc(db, "chats", chatId, "messages", docSnap.id);
        const deletedFor = new Set(messageData.deletedFor || []);
        deletedFor.add(userId);

        const updatedDeletedFor = Array.from(deletedFor);

        if (
          updatedDeletedFor.includes(messageData.senderId) &&
          updatedDeletedFor.includes(messageData.receiverId)
        ) {
          if (messageData.img) {
            imagesToDelete.push(messageData.img);
          }

          batch.delete(messageRef);
        } else {
          batch.update(messageRef, { deletedFor: updatedDeletedFor });
        }
      });

      await batch.commit();

      await Promise.all(
        imagesToDelete.map(async (imageUrl) => {
          const storagePath = extractStoragePath(imageUrl);
          if (storagePath) {
            const imageRef = ref(storage, storagePath);
            await deleteObject(imageRef);
            console.log("Image deleted for storage : ", storagePath);
          }
        })
      );

      // ✅ Update chatList only for current user (Not for other user)
      const currentUserRef = doc(db, "users", userId);
      const currentUserSnap = await getDoc(currentUserRef);

      if (currentUserSnap.exists()) {
        const userData = currentUserSnap.data();
        const chatList = userData.chatList || [];

        // 🔥 Update lastMessage to empty or placeholder text
        const updatedChatList = chatList.map((chat) =>
          chat.chatId === chatId
            ? { ...chat, lastMessage: "", updatedAt: new Date() }
            : chat
        );

        await updateDoc(currentUserRef, { chatList: updatedChatList });
      }

      // console.log("Chat cleared successfully for current user.");
    } catch (error) {
      console.error("Clear Chat Error:", error);
    }
  },
}));

export default useChatStore;
