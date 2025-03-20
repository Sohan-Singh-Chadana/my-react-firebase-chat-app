// ✅ Utility to detect message type, emoji, and numbers
export const detectMessageType = (text) => {
  const emojiRegex = /^[\p{Emoji}\s]+$/gu; // ✅ Detects only emoji or spaces
  const mixedEmojiRegex = /[\p{Emoji}]/gu; // ✅ Detect emoji anywhere
  const hindiRegex = /[\u0900-\u097F]/; // ✅ Detect Hindi characters
  const numberRegex = /^\+?[0-9\s-]+$/; // ✅ Detect numbers, including +, -, and spaces

  const trimmedText = text.trim();

  // ✅ Check for only numbers
  if (numberRegex.test(trimmedText)) {
    return "english"; // ✅ Treat pure numbers as normal text
  }

  // ✅ Only emoji (with optional spaces)
  if (emojiRegex.test(trimmedText)) {
    return "emoji";
  }

  // ✅ Check for emojis mixed with text, but ignore numbers
  if (mixedEmojiRegex.test(trimmedText) && !numberRegex.test(trimmedText)) {
    return "mixed";
  }

  // ✅ Check if text is Hindi
  if (hindiRegex.test(trimmedText)) {
    return "hindi";
  }

  // ✅ Default to English if no emoji or Hindi
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
      className={`normal-text`} // ✅ Add bold for long text
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
