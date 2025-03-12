import { useEffect, useRef, useState } from "react";

const useVisibleDateObserver = () => {
  const [visibleDate, setVisibleDate] = useState(null);
  const observer = useRef(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const messageDate = entry.target.getAttribute("data-date");
            setVisibleDate(messageDate);
            break; // Stop after finding the first visible message
          }
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.8 } // Adjust threshold as needed
    );

    return () => {
      observer.current.disconnect();
    };
  }, []);

  const observeElement = (el) => el && observer.current?.observe(el);

  return { visibleDate, observeElement };
};

export default useVisibleDateObserver;
