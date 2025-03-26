import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // ✅ Correct import
import "./ChatItemSkeleton.css"; // ✅ Your custom styles
import { useEffect, useState } from "react";

const ChatItemSkeleton = () => {
  const [theme, setTheme] = useState("light");

  // ✅ Detect Dark Mode Automatically or Manually Toggle
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setTheme(currentTheme || "light");
  }, []);

  return (
    <SkeletonTheme
      baseColor={theme === "dark" ? "#2a3942" : "#ebebeb"} // ✅ Set Dark Mode Colors
      highlightColor={theme === "dark" ? "#1f2b33" : "#f5f5f5"}
    >
      <div className="chat-item-skeleton">
        <div className="chat-content-skeleton">
          <Skeleton
            width={50}
            height={50}
            style={{ borderRadius: "50%", marginLeft: "15px" }}
          />

          <div className="chat-info-skeleton">
            {/* <div className="name-skeleton">
            <Skeleton width={150} height={20} />
            <Skeleton width={100} height={20} />
          </div>
          <Skeleton width={"98%"} height={20} /> */}
            <Skeleton width={"98%"} height={60} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default ChatItemSkeleton;
