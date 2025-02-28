import { MdMoreVert } from "react-icons/md";
import "./menuContainer.css";
import useMenuStore from "../../../store/menuStore";
import { useOutsideClick } from "../../../hooks";

const MenuContainer = ({
  menuId,
  iconClass = "",
  menuClass = "",
  children,
}) => {
  const { menus, setMenuOpen } = useMenuStore();
  const menuOpen = menus[menuId] || false;

  const menuRef = useOutsideClick(
    () => setMenuOpen(menuId, false),
    menuOpen,
    "menu-btn"
  );

  return (
    <div className="menu-wrapper" ref={menuRef}>
      {/* Button is outside menuRef to avoid immediate closing */}
      <div
        onClick={() => setMenuOpen(menuId, !menuOpen)}
        className={`menu-btn ${menuOpen ? "active" : ""} ${iconClass}`}
      >
        <MdMoreVert />
      </div>

      {/* Menu container (listens for outside click) */}
      <div className={`menu ${menuOpen ? "open" : ""} ${menuClass}`}>
        {children}
      </div>
    </div>
  );
};

export default MenuContainer;
