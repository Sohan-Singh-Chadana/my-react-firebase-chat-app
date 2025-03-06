import dayjs from "dayjs";

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
