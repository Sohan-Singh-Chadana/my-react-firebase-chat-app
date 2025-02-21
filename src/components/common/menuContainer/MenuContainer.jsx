import { useEffect, useRef } from "react";
import { MdMoreVert } from "react-icons/md";
import "./menuContainer.css";
import useMenuStore from "../../store/menuStore";

const MenuContainer = ({
  menuId,
  iconClass = "",
  menuClass = "",
  children,
}) => {
  const { menus, setMenuOpen } = useMenuStore();
  const menuOpen = menus[menuId] || false;

  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(menuId, false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="menu-container" ref={menuRef}>
      <div
        onClick={() => setMenuOpen(menuId, !menuOpen)}
        className={`menu-btn ${menuOpen ? "active" : ""} ${iconClass}`}
      >
        <MdMoreVert />
      </div>
      <div className={`menu ${menuOpen ? "open" : ""} ${menuClass}`}>
        {children}
      </div>
    </div>
  );
};

export default MenuContainer;
