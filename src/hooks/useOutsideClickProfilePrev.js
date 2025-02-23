import { useEffect } from "react";

const useOutsideClick = (
  avatarPreviewRef,
  profilePrvBoxRef,
  closeProfileMenu
) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!avatarPreviewRef.current || !profilePrvBoxRef.current) return;

      const isClickInsideProfilePreview = avatarPreviewRef.current.contains(
        event.target
      );
      const isClickInsideProfileBox = profilePrvBoxRef.current.contains(
        event.target
      );

      if (isClickInsideProfilePreview && !isClickInsideProfileBox) {
        closeProfileMenu();
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [avatarPreviewRef, profilePrvBoxRef, closeProfileMenu]);
};

export default useOutsideClick;
