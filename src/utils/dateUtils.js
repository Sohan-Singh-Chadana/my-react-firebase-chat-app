import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import "dayjs/locale/en"; // English locale (optional)

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale("en"); // Set locale to English

dayjs.extend(isToday);
dayjs.extend(isYesterday);

// Format Last Seen Time
export const formatLastSeen = (lastSeen) => {
  if (!lastSeen) return "Offline";

  const now = dayjs();
  const lastSeenDate = dayjs(lastSeen);

  if (lastSeenDate.isSame(now, "day")) {
    return `Last seen Today at ${lastSeenDate.format("h:mm A")}`;
  } else if (lastSeenDate.isSame(now.subtract(1, "day"), "day")) {
    return `Last seen Yesterday at ${lastSeenDate.format("h:mm A")}`;
  } else {
    return `Last seen on ${lastSeenDate.format("DD/MM/YYYY [at] h:mm A")}`;
  }
};

// Get Chat Day (for grouping messages by day)
export const getChatDay = (formattedDate) => {
  const date = dayjs(formattedDate);
  const today = dayjs();
  const oneWeekAgo = today.subtract(7, "day");

  if (date.isToday()) return "Today";
  if (date.isYesterday()) return "Yesterday";
  if (date.isAfter(oneWeekAgo)) return date.format("dddd"); // Monday, Tuesday, etc.

  return date.format("DD/MM/YYYY"); // Show full date if older than a week
};

// Format Timestamp (for Firestore timestamps)
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";

  const date = dayjs(timestamp * 1000); // Convert Firestore timestamp to date
  const today = dayjs();
  const oneWeekAgo = today.subtract(7, "day");

  if (date.isSame(today, "day")) return date.format("hh:mm A");
  if (date.isSame(today.subtract(1, "day"), "day")) return "Yesterday";
  if (date.isAfter(oneWeekAgo)) return date.format("dddd");

  return date.format("DD/MM/YYYY"); // Show full date for older messages
};

// ✅ Format MessageTimeStamp to "hh:mm A" format (e.g., 10:30 PM)
export const formatMessageTime = (timestamp) => {
  if (!timestamp) return;
  return dayjs(timestamp * 1000).format("hh:mm A");
};

// ✅ Get the current date in "YYYY-MM-DD" format
export const getFormattedDate = () => {
  return dayjs().format("YYYY-MM-DD");
};
