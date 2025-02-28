const getWallpaperColor = (hoveredWallpaper, selectedWallpaper, showWallpaperImage) => {
  const bgColor =
    hoveredWallpaper !== null
      ? hoveredWallpaper === "default"
        ? "var(--chat-bg-color)"
        : hoveredWallpaper
      : selectedWallpaper === "default"
      ? "var(--chat-bg-color)"
      : selectedWallpaper;

  const bgImage = showWallpaperImage ? 'url("./chat-bg.png")' : "none";

  return {
    backgroundColor: bgColor,
    backgroundImage: bgImage,
  };
};

export default getWallpaperColor;
