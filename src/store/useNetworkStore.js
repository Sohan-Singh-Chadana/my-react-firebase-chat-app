import { create } from "zustand";

export const useNetworkStore = create((set) => ({
  isOnline: navigator.onLine, 
  setIsOnline: (status) => set({ isOnline: status }),
}));
