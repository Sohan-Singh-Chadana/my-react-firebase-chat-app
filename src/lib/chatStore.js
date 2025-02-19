import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase/firebase";
import { useUserStore } from "./userStore";

export const useChatStore = create((set) => ({
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
}));

// export const useChatStore = create((set) => ({
//   chatId: null,
//   user: null,
//   isCurrentUserBlocked: false,
//   isReceiverBlocked: false,

//   changeChat: async (chatId, user) => {
//     const currentUser = useUserStore.getState().currentUser;

//     if (!chatId || !user) {
//       console.error("❌ Error: chatId or user is undefined", { chatId, user });
//       return;
//     }

//     if (!currentUser || !currentUser.userId) {
//       console.error("⛔ Current user data is missing in changeChat function!");
//       return;
//     }

//     try {
//       // ✅ Firestore से latest user data लाना (blocking check के लिए)
//       const userDocRef = doc(db, "users", currentUser.userId);
//       const userDocSnap = await getDoc(userDocRef);

//       if (!userDocSnap.exists()) {
//         console.error("⛔ Current user not found in Firestore!");
//         return;
//       }

//       const currentUserData = userDocSnap.data();
//       const currentUserBlockedUsers = Array.isArray(
//         currentUserData.blockedUsers
//       )
//         ? currentUserData.blockedUsers
//         : [];

//       const userBlockedUsers = Array.isArray(user.blockedUsers)
//         ? user.blockedUsers
//         : [];

//       // ✅ Check if current user is blocked by the receiver
//       if (userBlockedUsers.includes(currentUser.userId)) {
//         set({
//           chatId,
//           user: null,
//           isCurrentUserBlocked: true,
//           isReceiverBlocked: false,
//         });
//         console.warn(`⛔ You are blocked by ${user.name}`);
//         return;
//       }

//       // ✅ Check if receiver is blocked by the current user
//       if (currentUserBlockedUsers.includes(user.userId)) {
//         set({
//           chatId,
//           user,
//           isCurrentUserBlocked: false,
//           isReceiverBlocked: true,
//         });
//         console.warn(`⛔ You have blocked ${user.name}`);
//         return;
//       }

//       // ✅ Default case (chat allowed)
//       set({
//         chatId,
//         user,
//         isCurrentUserBlocked: false,
//         isReceiverBlocked: false,
//       });

//       // console.log(`✅ Chat switched to ${user.name}`);
//     } catch (error) {
//       console.error("❌ Error in changeChat:", error);
//     }
//   },
//   changeBlock: () => {
//     set((state) => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }));
//   },
// }));
