import "./ProfileMenu.css";
import { useOutsideClick } from "../../../../hooks";

const ProfileMenu = ({ menuOpen, setMenuOpen, position, children }) => {

  const menuRef = useOutsideClick(() => setMenuOpen(false), menuOpen, ".img-wrapper")

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
