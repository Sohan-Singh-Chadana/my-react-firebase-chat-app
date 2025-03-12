/**
 * Extracts the image path from Firebase Storage URL
 */

/**
 * Firebase Storage URL से path extract करता है ताकि इसे delete किया जा सके।
 * @param {string} imageUrl - Firebase Storage में image URL
 * @returns {string | null} - Storage path या null
 */

export const extractStoragePath = (imageUrl) => {
  try {
    const matches = imageUrl.match(/\/o\/(.*?)\?alt=media/);
    if (matches && matches[1]) {
      return decodeURIComponent(matches[1]);
    }
    return null;
  } catch (error) {
    console.error(" Error extracting storage path: ", error);
    return null;
  }
};
