// ✅ Detect if the message contains only emojis
export const isEmojiOnly = (text) => {
  const emojiRegex = /[\p{Emoji}]/gu; // ✅ Match only emoji characters
  const numberRegex = /[0-9\s+-.]/g; // ✅ Ignore numbers, spaces, +, and -

  // ✅ Remove numbers and special characters before checking emoji-only
  const cleanedText = text.replace(numberRegex, "").trim();

  // ✅ Check if cleaned text contains only emojis
  const hasEmoji = emojiRegex.test(cleanedText);
  const onlyEmojis = cleanedText.replace(emojiRegex, "").trim().length === 0;

  return onlyEmojis && hasEmoji;
};
