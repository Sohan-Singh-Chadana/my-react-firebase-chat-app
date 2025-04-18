import { useWallpaperStore } from "../../../../../store";
import { getWallpaperColor } from "../../../../../utils";
import "./WallpaperPreview.css";

const WallpaperPreview = () => {
  const { hoveredWallpaper, selectedWallpaper, showWallpaperImage } =
    useWallpaperStore();

  return (
    <div className="wallpaper-preview">
      <h4 className="wallpaper-heading">Wallpaper Preview</h4>
      <div
        className="wallpaper-preview__container"
        style={getWallpaperColor(
          hoveredWallpaper,
          selectedWallpaper,
          showWallpaperImage
        )}
      ></div>
    </div>
  );
};

export default WallpaperPreview;
