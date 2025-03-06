import { useCallback, useEffect, useRef, useState } from "react";

export const useScrollButton = () => {
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const chatContainerRef = useRef(null);
  const userScrolledUp = useRef(false); // ✅ Track if user scrolls up

  // Function to scroll to the bottom manually
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Handle Scroll event
  const handleScroll = useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollHeight, scrollTop, clientHeight } =
        chatContainerRef.current;
      const scrollOffset = 100;

      // setShowScrollBtn(scrollTop + clientHeight < scrollHeight - scrollOffset);
      const atBottom = scrollTop + clientHeight >= scrollHeight - scrollOffset;
      setShowScrollBtn(!atBottom); // ✅ Show button only when not at bottom
      userScrolledUp.current = !atBottom; // ✅ Track if user scrolled up
    }
  }, []);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  // return { chatContainerRef, showScrollBtn, scrollToBottom };
  return { chatContainerRef, showScrollBtn, scrollToBottom, userScrolledUp };
};
