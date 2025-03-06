import React, { memo } from "react";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

import Message from "./Message";
import UnreadMessageBadge from "./UnreadMessageBadge";

import "./ChatMessages.css";
import { useMessageSelectionStore } from "../../../store";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

const getChatDay = (formattedDate) => {
  const date = dayjs(formattedDate);
  const today = dayjs();
  const oneWeekAgo = today.subtract(7, "day");

  if (date.isToday()) return "Today";
  if (date.isYesterday()) return "Yesterday";
  if (date.isAfter(oneWeekAgo)) return date.format("dddd"); // Monday, Tuesday, etc.

  return date.format("DD/MM/YYYY"); // Show full date if older than a week
};

const ChatMessages = ({ messages, unreadCount }) => {
  let lastDate = null;
  const { showCheckboxes } = useMessageSelectionStore();

  return (
    <div className={`chat-messages ${showCheckboxes ? "show-checkboxes" : ""}`}>
      {messages.map((message, index) => {
        const messageDate = message.formattedDate;
        const showDate = messageDate !== lastDate;
        lastDate = messageDate;

        return (
          <React.Fragment key={message.id || index}>
            {showDate && (
              <span className="chatDay">{getChatDay(messageDate)}</span>
            )}

            {/* Display Unread Message Badge */}
            {unreadCount > 0 && messages.length - unreadCount === index && (
              <UnreadMessageBadge unreadCount={unreadCount} />
            )}

            {/* Display Message */}
            <Message message={message} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default memo(ChatMessages);
