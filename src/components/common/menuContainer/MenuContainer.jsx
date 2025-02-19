import React from "react";
import { MdMoreVert } from "react-icons/md";
import "./menuContainer.css";

const MenuContainer = ({ menuOpen, setMenuOpen, menuRef, children }) => {
  return (
    <div className="menu-container" ref={menuRef}>
      <MdMoreVert
        onClick={() => setMenuOpen((prev) => !prev)}
        className={menuOpen ? "active" : ""}
      />
      {menuOpen && <div className="menu">{children}</div>}
    </div>
  );
};

export default MenuContainer;
