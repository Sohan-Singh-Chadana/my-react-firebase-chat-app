import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { enableIndexedDbPersistence, getFirestore, initializeFirestore, persistentLocalCache } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-97ae8.firebaseapp.com",
  projectId: "reactchat-97ae8",
  storageBucket: "reactchat-97ae8.firebasestorage.app",
  messagingSenderId: "284350675216",
  appId: "1:284350675216:web:3d1dea5c3580eeb6210d95",
};

const app = initializeApp(firebaseConfig);


// ✅ New Firestore Initialization with Offline Persistence
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});


// export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

