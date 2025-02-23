import { useEffect } from "react";

const useAvatarHoverEffect = (avatarRef, avatar, currentUser) => {
  useEffect(() => {
    const avatarElement = avatarRef.current;

    const handleMouseOver = () => {
      if (avatarElement && currentUser.profilePic) {
        avatarElement.classList.add("active");
      }
    };

    const handleMouseLeave = () => {
      if (avatarElement && currentUser.profilePic) {
        avatarElement.classList.remove("active");
      }
    };

    if (avatarElement) {
      if (!avatar.url) {
        avatarElement.addEventListener("mouseover", handleMouseOver);
      }
      avatarElement.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (avatarElement) {
        avatarElement.removeEventListener("mouseover", handleMouseOver);
        avatarElement.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [avatarRef, avatar, currentUser]);
};

export default useAvatarHoverEffect;
