import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { storage } from "../lib/firebase/firebase";

// ✅ Clean file name to avoid issues with special characters
const cleanFileName = (name) => {
  return name.replace(/[^a-zA-Z0-9.]/g, "_");
};

const upload = async (file) => {
  // ✅ Extract file type and extension
  const fileType = file.type.split("/")[0];
  const fileExtension = file.name.split(".").pop().toLowerCase();

  try {
    // ✅ Check for unsupported file types
    if (!["image", "video", "application"].includes(fileType)) {
      throw new Error(`❌ Unsupported file type: ${fileType}`);
    }

    let finalFile = file; // ✅ Default to original file (for videos & documents)

    // ✅ Compress only images before uploading
    if (fileType === "image") {
      const options = {
        maxSizeMB: 2, // ✅ Max size 2MB
        maxWidthOrHeight: 1080, // ✅ Max width/height
        useWebWorker: true, // ✅ Faster compression
      };

      // ✅ Compress the image
      finalFile = await imageCompression(file, options);
    }

    // ✅ Generate Unique File Name
    const date = new Date().toISOString();
    const storagePath =
      fileType === "image"
        ? `images/${date}_${cleanFileName(finalFile.name)}`
        : fileType === "video"
        ? `videos/${date}_${cleanFileName(file.name)}`
        : `documents/${date}_${cleanFileName(file.name)}`;

    // ✅ Create Storage Reference and Upload
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, finalFile);

    // ✅ Return Download URL after Upload
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log(`✅ Upload is ${progress.toFixed(1)}% done`);
        },
        (error) => {
          console.error("❌ Upload failed:", error);
          reject(`Upload failed! Error: ${error.code}`);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error("❌ Error getting download URL:", error);
            reject(`Failed to retrieve download URL! Error: ${error.code}`);
          }
        }
      );
    });
  } catch (error) {
    console.error("❌ Upload failed:", error);
    throw error;
  }
};

export default upload;
