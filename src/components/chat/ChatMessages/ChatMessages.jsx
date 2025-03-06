import React, { memo } from "react";
import { useMessageSelectionStore } from "../../../store";
import { getChatDay } from "../../../utils";

import Message from "./Message";
import UnreadMessageBadge from "./UnreadMessageBadge";
import "./ChatMessages.css";

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
