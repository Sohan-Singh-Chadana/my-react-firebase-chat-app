import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase/firebase";

// ✅ Zustand store for managing user state
export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,

  // ✅ Optimized function (stabilized)
  fetchUserInfo: async (uid) => {
    if (!uid) {
      set((state) => ({ currentUser: null, isLoading: false }));
      return;
    }

    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set((state) => ({
          currentUser: { uid, ...docSnap.data() },
          isLoading: false,
        }));
      } else {
        set((state) => ({ currentUser: null, isLoading: false }));
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      set((state) => ({ currentUser: null, isLoading: false }));
    }
  },
}));
