import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import Login from "./components/auth/login/Login";
import Notification from "./components/notification/Notification";
import Home from "./components/home/Home";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "./store/userStore";
import { useChatStore } from "./store/chatStore";
import useGlobalStateStore from "./store/globalStateStore";
import { Sidebar } from "./components/sidebar/Sidebar";
import { auth } from "./lib/firebase/firebase";
import { setUserOffline, setUserOnline } from "./hooks/useUserStatus";
import WallpaperPreview from "./components/sidebar/Setting/ChatSetting/WallpaperPreview";
import useSettingStore from "./store/useSettingStore";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
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
      setUserOnline(currentUser.userId);
    }

    const handleBeforeUnload = () => {
      if (currentUser?.userId) {
        setUserOffline(currentUser.userId);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
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
