import { useEffect, useRef } from "react";

export const useAutoScroll = (messages) => {
  const endRef = useRef(null);
  const userScrolledUp = useRef(false); // Track user manual scrolling

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  // return { endRef };
  return { endRef, userScrolledUp };
};
