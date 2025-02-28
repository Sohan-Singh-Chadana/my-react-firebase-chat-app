import { useEffect, useRef } from "react";

/**
 * Custom hook to handle clicks outside a specified element.
 * Also supports Escape key press.
 *
 * @param {Function} onClose - Function to call when clicked outside or Esc key is pressed.
 * @param {boolean} isActive - Whether the event listeners should be active.
 * @param {string} [exceptionClass] - Optional: Class name to ignore clicks (e.g., ".img-wrapper").
 * @returns {Object} ref - The reference to attach to the component.
 */
const useOutsideClick = (onClose, isActive = true, exceptionClass = "") => {
  const ref = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event) => {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        (!exceptionClass || !event.target.closest(exceptionClass))
      ) {
        onClose?.(event);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, onClose, exceptionClass]);

  return ref;
};

export default useOutsideClick;
