import { useEffect, useRef } from "react";
import "./ProfileMenu.css";

const ProfileMenu = ({ menuOpen, setMenuOpen, position, children }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest(".img-wrapper")
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setMenuOpen]);

  return (
    <div className="profile-menu" ref={menuRef}>
      <div
        className={`menu ${menuOpen ? "open" : ""}`}
        style={{
          position: "absolute",
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ProfileMenu;
