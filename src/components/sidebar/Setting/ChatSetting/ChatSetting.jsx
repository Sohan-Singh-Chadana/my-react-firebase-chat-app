import { useContext, useState } from "react";
import { ThemeContext } from "../../../../context/ThemeContext";
import ThemeSelector from "./ThemeSelector/ThemeSelector";
import SettingsHeader from "../../../common/SettingsHeader";
import ChatSettingItem from "./ChatSettingItem";
import "./ChatSetting.css";
import WallpaperSelector from "./WallpaperSelector";
import { useSettingStore, useWallpaperStore } from "../../../../store";


const ChatSetting = ({ onBack }) => {
  const { theme } = useContext(ThemeContext);
  const { activeSetting, openSetting } = useSettingStore();
  const { selectedWallpaper } = useWallpaperStore();

  // JavaScript object lookup
  const themeText =
    {
      light: "Light mode",
      dark: "Dark mode",
      system: "System default",
    }[theme] || "System default";

  const openThemeOption = (e) => {
    e.stopPropagation();
    openSetting("theme");
  };

  return (
    <section className="chats-setting">
      <SettingsHeader title="Chats" onBack={onBack} />
      <div className="theme-container">
        <span className="display-text">Display</span>

        <ChatSettingItem
          label="Theme"
          value={themeText}
          onClick={openThemeOption}
        />
        <ChatSettingItem
          label="Wallpaper"
          value={selectedWallpaper === "default" ? "Default" : ""}
          onClick={() => openSetting("wallpaper")}
        />

        {/* Show Theme Modal */}
        {activeSetting === "theme" && <ThemeSelector />}

        {/* Show Wallpaper Modal */}
        <WallpaperSelector />
      </div>
    </section>
  );
};
export default ChatSetting;
