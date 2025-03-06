import { useContext } from "react";
import { toast } from "react-toastify";
import { useSettingStore, useWallpaperStore } from "../../../../../store";

import {
  WALLPAPER_COLORS_DARK,
  WALLPAPER_COLORS_LIGHT,
} from "../../../../../constants/wallpaperColors";

import SettingsHeader from "../../../../common/SettingsHeader";
import { ThemeContext } from "../../../../../context/ThemeContext";
import "./WallpaperSelector.css";

const WallpaperSelector = () => {
  const { activeSetting, closeSetting } = useSettingStore();
  const {
    selectedWallpaper,
    setSelectedWallpaper,
    setHoveredWallpaper,
    showWallpaperImage,
    setShowWallpaperImage,
  } = useWallpaperStore();
  const { theme } = useContext(ThemeContext);

  const handleWallpaperClick = (wallpaper) => {
    setSelectedWallpaper(wallpaper);
    toast.success("Wallpaper changed successfully");
  };

  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const appliedTheme =
    theme === "system" ? (systemPrefersDark ? "dark" : "light") : theme;

  const colorArray =
    appliedTheme === "dark" ? WALLPAPER_COLORS_DARK : WALLPAPER_COLORS_LIGHT;

  return (
    <div
      className={`wallpaper-container ${
        activeSetting === "wallpaper" ? "show" : ""
      }`}
    >
      <SettingsHeader title="Set chat wallpaper" onBack={closeSetting} />
      <div className="wallpaper-option">
        <div className="wallpaper-image">
          <input
            type="checkbox"
            name="wallpaper-image"
            id="image-wallpaper"
            className="custom-checkbox"
            checked={showWallpaperImage}
            onChange={setShowWallpaperImage}
          />
          <span>Add ChatApp boodles</span>
        </div>
        <ul className="color-list">
          <li
            className={`color-list-item default ${
              selectedWallpaper === "default" ? "selected" : ""
            }`}
            onClick={() => handleWallpaperClick("default")}
            onMouseEnter={() => setHoveredWallpaper("default")}
            onMouseLeave={() => setHoveredWallpaper(null)}
          >
            Default
          </li>
          {colorArray.map((color, index) => (
            <li
              key={index}
              className={`color-list-item ${
                selectedWallpaper === color ? "selected" : ""
              }`}
              style={{ backgroundColor: color }}
              onMouseEnter={() => setHoveredWallpaper(color)}
              onMouseLeave={() => setHoveredWallpaper(null)}
              onClick={() => handleWallpaperClick(color)}
            ></li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WallpaperSelector;
