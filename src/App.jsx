import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase/firebase";
import { setUserOffline, setUserOnline } from "./services/userStatusService";

import {
  useChatStore,
  useGlobalStateStore,
  useNetworkStore,
  useSettingStore,
  useUserStore,
} from "./store";
import { markAllMessagesAsSent } from "./utils";

import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import Login from "./components/auth/login/Login";
import Notification from "./components/notification/Notification";
import Home from "./components/home/Home";
import Sidebar from "./components/sidebar/Sidebar";
import WallpaperPreview from "./components/sidebar/Setting/ChatSetting/WallpaperPreview";

const App = () => {
  const { currentUser, isLoading } = useUserStore();
  const { chatId } = useChatStore();
  const { showDetail } = useGlobalStateStore();
  const { activeSetting } = useSettingStore();

  // ✅ Firebase Authentication listener
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      useUserStore.getState().fetchUserInfo(user?.uid);
    });

    return () => unSub && unSub(); // ✅ Proper cleanup
  }, []);

  useEffect(() => {
    if (currentUser?.userId) {
      setUserOnline(currentUser.userId); // Ensure user is online at start

      const { setIsOnline } = useNetworkStore.getState();

      const handleOnline = () => {
        // console.log("🟢 User came online, retrying pending messages...");
        setIsOnline(true);
        setUserOnline(currentUser.userId); // Mark user online
        markAllMessagesAsSent(currentUser.userId); // ✅ Retry marking messages as sent
      };

      const handleOffline = () => {
        if (currentUser?.userId) {
          // console.log("🔴 User went offline, marking as offline...");
          setIsOnline(false);
          setUserOffline(currentUser.userId);
        }
      };

      const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden" && currentUser?.userId) {
          // console.log("🔴 App hidden, marking user offline...");
          setUserOffline(currentUser.userId);
        } else if (
          document.visibilityState === "visible" &&
          currentUser?.userId
        ) {
          // console.log("🟢 App visible again, marking user online...");
          setUserOnline(currentUser.userId); // ✅ Ensure user is online when they return
          markAllMessagesAsSent(currentUser.userId); // ✅ Retry sending pending messages
        }
      };

      // ✅ Initial check
      setIsOnline(navigator.onLine);
      // ✅ Initial execution when online
      if (navigator.onLine) {
        markAllMessagesAsSent(currentUser.userId);
      }

      // ✅ Listen for online/offline status and visibility changes
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }
  }, [currentUser?.userId]);

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <>
      <div className="header-back"></div>
      <div className="container-back"></div>
      <main className="main">
        <div className="container">
          {currentUser ? (
            <div
              className={`chat-container ${showDetail ? "detail-open" : ""}`}
            >
              <Sidebar />

              {chatId ? (
                <>
                  <Chat />
                  <Detail />
                </>
              ) : activeSetting === "wallpaper" ? (
                <WallpaperPreview />
              ) : (
                <Home />
              )}
            </div>
          ) : (
            <Login />
          )}
          <Notification />
        </div>
      </main>
    </>
  );
};

export default App;
