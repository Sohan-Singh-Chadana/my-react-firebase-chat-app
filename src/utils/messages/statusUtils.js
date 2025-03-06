import { MdCheck, MdDoneAll } from "react-icons/md";
import React from "react";

export const getStatusIcon = (status) => {
  switch (status) {
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
