import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { storage } from "../lib/firebase/firebase";

const upload = async (file) => {
  const options = {
    maxSizeMB: 2, // Set the max file size (1MB)
    maxWidthOrHeight: 1080, // Resize image max width/height
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);

    const date = new Date();
    const storageRef = ref(storage, `images/${date + compressedFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, compressedFile);

    // const storageRef = ref(storage, `images/${date + file.name}`);
    // const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject("Something went wrong!" + error.code);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  } catch (error) {
    console.error("Image compression failed:", error);
    throw error;
  }
};

export default upload;
