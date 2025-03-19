// ✅ Detect if the message contains only emojis
export const isEmojiOnly = (text) => {
  const emojiRegex = /[\p{Emoji}]/gu;
  const hasEmoji = emojiRegex.test(text);
  const onlyEmojis = text.replace(emojiRegex, "").trim().length === 0;
  return onlyEmojis && hasEmoji;
};


