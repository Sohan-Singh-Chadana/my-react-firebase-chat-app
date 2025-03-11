import React, { memo } from "react";
import { useMessageSelectionStore } from "../../../store";
import { useVisibleDateObserver } from "../../../hooks";
import { getChatDay } from "../../../utils";

import Message from "./Message";
import UnreadMessageBadge from "./UnreadMessageBadge";
import "./ChatMessages.css";

const ChatMessages = ({ messages, unreadCount }) => {
  let lastDate = null;
  const { showCheckboxes } = useMessageSelectionStore();
  const { visibleDate, observeElement } = useVisibleDateObserver();
  const [unreadIndex, setUnreadIndex] = React.useState(null);

  React.useEffect(() => {
    if (unreadCount > 0 && unreadIndex === null) {
      // 📌 पहली बार unread messages detect होने पर index store करें
      setUnreadIndex(messages.length - unreadCount);
    }
  }, [messages.length, unreadCount, unreadIndex]);

  return (
    <div className={`chat-messages ${showCheckboxes ? "show-checkboxes" : ""}`}>
      {/* Show date only while scrolling */}
      {visibleDate && (
        <span className="chatDayScroll">{getChatDay(visibleDate)}</span>
      )}

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
            {unreadCount > 0 && unreadIndex === index && (
              <UnreadMessageBadge unreadCount={unreadCount} />
            )}

            {/* Display Message */}
            <div ref={observeElement} data-date={messageDate}>
              <Message message={message} index={index} messages={messages} />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default memo(ChatMessages);
