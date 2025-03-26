import { deleteObject, ref } from "firebase/storage";
import { extractStoragePath } from "../../storageUtils";
import { storage } from "../../../lib/firebase/firebase";

export const deleteMediaFiles = async (messageData) => {
  const mediaTypes = ["media", "docUrl"];

  for (const mediaType of mediaTypes) {
    if (messageData[mediaType]) {
      try {
        const fileUrl = messageData[mediaType];
        const storagePath = extractStoragePath(fileUrl);

        if (storagePath) {
          const fileRef = ref(storage, storagePath);
          await deleteObject(fileRef);
        //   console.log(
        //     `✅ ${mediaType} deleted from Firebase Storage:`,
        //     storagePath
        //   );
        }
      } catch (error) {
        console.error(
          `❌ Error deleting ${mediaType} from Firebase Storage:`,
          error
        );
      }
    }
  }
};
