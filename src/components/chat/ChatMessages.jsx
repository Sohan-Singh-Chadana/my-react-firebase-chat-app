import React from "react";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import { getStatusIcon } from "../../utils/messageUtils";

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

const ChatMessages = ({ messages, currentUser }) => {
  let lastDate = null;

  return (
    <div className="messageBox">
      {messages.map((message, index) => {
        const messageDate = message.formattedDate; // ✅ Read from Firestore
        const showDate = messageDate !== lastDate;
        lastDate = messageDate; // ✅ Keep track of last message date

        return (
          <React.Fragment key={message.id}>
            {showDate && (
              <span className="chatDay">{getChatDay(messageDate)}</span>
            )}
            <div
              className={
                message.senderId === currentUser.userId
                  ? "message own"
                  : "message"
              }
            >
              <span className="pointer"></span>
              <div className="message-content">
                <div
                  className={
                    message.img && message.text
                      ? "images"
                      : message.img
                      ? "images"
                      : "texts"
                  }
                >
                  {message.img && (
                    <div
                      className={`image-box ${
                        message.img && !message.text ? "with-gradient" : ""
                      }`}
                    >
                      {message.img && <img src={message.img} alt="" />}
                    </div>
                  )}

                  {message.text && (
                    <div className="message-text" style={{padding: message.text.length > 20 ? '8px 10px' : '0px'}}>
                      <pre>{message.text}</pre>
                    </div>
                  )}

                  <span
                    className={
                      message.img && message.text
                        ? "imgSpan"
                        : message.img
                        ? "imgSpan"
                        : "textSpan"
                    }
                    style={{
                      color:
                        message.img && message.text
                          ? "var(--text-secondary)"
                          : message.img
                          ? "white"
                          : "var(--text-secondary)",
                      position:
                        message.text.split(" ").length > 10
                          ? "absolute"
                          : "unset",
                      bottom:
                        message.text.split(" ").length > 10 ? "2px" : "0%",
                      right: message.text.split(" ").length > 10 ? "2px" : "0%",
                      paddingRight:
                        message.text.split(" ").length > 10 ? "10px" : "0%",
                    }}
                  >
                    {dayjs(message.timestamp * 1000).format("hh:mm A")}
                    {message.senderId === currentUser.userId &&
                      (() => {
                        const StatusIcon = getStatusIcon(message);
                        return StatusIcon ? <StatusIcon /> : null;
                      })()}
                  </span>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ChatMessages;
