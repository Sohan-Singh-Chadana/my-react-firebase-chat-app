export const handleMediaDownload = async (mediaUrl, mediaType) => {
  try {
    if (!mediaUrl) {
      console.error("❌ No media URL found!");
      return;
    }

    // ✅ Fetch the media as a blob
    const response = await fetch(mediaUrl);
    if (!response.ok) {
      throw new Error("❌ Failed to fetch media");
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

    // ✅ Determine file extension based on media type
    const extension = mediaType === "video" ? "mp4" : "jpg";

    // ✅ Custom file name format: ChatName_Date_Time.fileExtension
    const fileName = `MyChatApp Image ${formattedDate} at ${formattedTimeCleaned}.${extension}`;

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

    // console.log(`✅ Image downloaded successfully: ${fileName}`);
  } catch (error) {
    console.error("❌ Error downloading image:", error);
  }
};
