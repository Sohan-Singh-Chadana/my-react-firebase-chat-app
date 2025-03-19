// ✅ Utility to detect message type, emoji, and numbers
export const detectMessageType = (text) => {
  const emojiRegex = /[\p{Emoji}]/gu;
  const hindiRegex = /[\u0900-\u097F]/; // Unicode for Hindi
  const numberRegex = /\d/; // Number detection
  const isEmojiOnly = text.replace(emojiRegex, "").trim().length === 0;
  const hasEmoji = emojiRegex.test(text);
  const hasNumbers = numberRegex.test(text);
  const isHindi = hindiRegex.test(text);

  if (isEmojiOnly) return "emoji";
  if (hasEmoji) return hasNumbers ? "mixed-number" : "mixed";
  if (isHindi) return "hindi";
  return "english";
};

// ✅ Function to render text with increased emoji size and normal size for numbers
export const formatMixedText = (text) => {
  const emojiRegex = /[\p{Emoji}]/gu;
  const numberRegex = /\d/; // Detect numbers in the message
  const parts = text.split(emojiRegex);
  const emojis = text.match(emojiRegex) || [];

  return parts.flatMap((part, index) => [
    <span
      key={`text-${index}`}
      className={`normal-text ${part.length >= 25 ? "bold-text" : ""}`} // ✅ Add bold for long text
    >
      {part}
    </span>,
    emojis[index] && (
      <span
        key={`emoji-${index}`}
        className={
          numberRegex.test(emojis[index]) ? "normal-emoji" : "large-emoji"
        }
      >
        {emojis[index]}
      </span>
    ),
  ]);
};

