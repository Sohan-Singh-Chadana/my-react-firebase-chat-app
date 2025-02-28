import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";

export const useUserStore = create((set, get) => ({
  currentUser: null,
  isLoading: true,

  // ✅ Fetch user info only if it's different from the current state
  fetchUserInfo: async (uid) => {
    if (!uid) {
      set({ currentUser: null, isLoading: false });
      return;
    }

    // ✅ If user data is already loaded, no need to fetch again
    const { currentUser } = get();
    if (currentUser && currentUser.uid === uid) {
      return;
    }

    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        set({ currentUser: { uid, ...userSnap.data() }, isLoading: false });
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
      set({ currentUser: null, isLoading: false });
    }
  },
}));
