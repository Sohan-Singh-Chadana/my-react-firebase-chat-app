// ✅ Detect if the message contains only emojis
export const isEmojiOnly = (text) => {
  const emojiRegex = /[\p{Extended_Pictographic}]/gu; // ✅ Match only emoji characters
  const numberRegex = /[0-9\s+-.]/g; // ✅ Ignore numbers, spaces, +, and -

  // ✅ Remove numbers and special characters before checking emoji-only
  const cleanedText = text.replace(numberRegex, "").trim();

  // ✅ Get all emojis from the text
  const emojis = cleanedText.match(emojiRegex) || [];

  // ✅ Check if only 1 emoji is present and nothing else
  return emojis.length === 1 && cleanedText === emojis[0];

  // ✅ Check if cleaned text contains only emojis
  // const hasEmoji = emojiRegex.test(cleanedText);
  // const onlyEmojis = cleanedText.replace(emojiRegex, "").trim().length === 0;

  // return onlyEmojis && hasEmoji;
};
