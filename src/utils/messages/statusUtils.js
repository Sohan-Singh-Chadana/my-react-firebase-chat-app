import { MdCheck, MdDoneAll } from "react-icons/md";
import React from "react";
import { LuClock3 } from "react-icons/lu";

export const getStatusIcon = (status) => {
  switch (status) {
    case "pending":
      return LuClock3;
    case "sent":
      return MdCheck; // Return component reference
    case "delivered":
      return MdDoneAll;
    case "read":
      // eslint-disable-next-line react/display-name
      return (props) =>
        React.createElement(MdDoneAll, {
          ...props,
          style: { color: "#66b7dc" },
        });
    default:
      return null;
  }
};
