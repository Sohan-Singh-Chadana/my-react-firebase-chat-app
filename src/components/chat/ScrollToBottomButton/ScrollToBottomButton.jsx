import { useRef } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const ScrollToBottomButton = ({ showScrollBtn, scrollToBottom }) => {
  const topToBottomBtnRef = useRef(null);

  return (
    <button
      className={showScrollBtn ? "topToBottomBtn active" : "topToBottomBtn"}
      ref={topToBottomBtnRef}
      onClick={scrollToBottom}
    >
      <MdKeyboardArrowDown />
    </button>
  );
};

export default ScrollToBottomButton;
