import PropTypes from "prop-types";
import { MdInsertDriveFile, MdImage, MdCameraAlt } from "react-icons/md";
import "./PopupMenu.css";

const PopupMenu = ({ onImagePreview, menuRef, menuOpen }) => {
  return (
    <div className={menuOpen ? "popup-menu open" : "popup-menu"} ref={menuRef}>
      <ul>
        <li>
          <MdInsertDriveFile /> <p>Document</p>
        </li>
        <li onClick={onImagePreview}>
          <MdImage /> <p>Photos & Videos</p>
        </li>
        <li>
          <MdCameraAlt /> <p>Camera</p>
        </li>
      </ul>
    </div>
  );
};

// Props validation
PopupMenu.propTypes = {
  onImagePreview: PropTypes.func.isRequired,
  menuRef: PropTypes.object.isRequired,
  menuOpen: PropTypes.bool.isRequired,
};

export default PopupMenu;
