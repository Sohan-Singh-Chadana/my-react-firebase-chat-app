export const handleImageDownload = async (imgUrl) => {
  try {
    if (!imgUrl) {
      console.error("❌ No image URL found!");
      return;
    }

    // ✅ Fetch the image as a blob
    const response = await fetch(imgUrl);
    if (!response.ok) {
      throw new Error("❌ Failed to fetch image");
    }

    const blob = await response.blob();

    // ✅ Get current date and time in WhatsApp format
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB").replace(/\//g, "-"); // 16-03-2025

    const formattedTime = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    const formattedTimeCleaned = formattedTime
      .replace(/\./g, "")
      .replace(/:/g, ".")
      .replace(/ /g, "");
    // ✅ Custom file name format: ChatName_Date_Time.jpg
    const fileName = `MyChatApp Image ${formattedDate} at ${formattedTimeCleaned}.jpg`;

    // ✅ Create a download link and trigger download
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;

    // ✅ Simulate click to start download
    document.body.appendChild(link);
    link.click();

    // ✅ Cleanup after download
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);

    console.log(`✅ Image downloaded successfully: ${fileName}`);
  } catch (error) {
    console.error("❌ Error downloading image:", error);
  }
};
