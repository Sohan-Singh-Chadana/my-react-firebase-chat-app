import { MdFullscreen } from "react-icons/md";

const FullscreenButton = ({ toggleFullscreen }) => {
  return (
    <button className="control-btn fullScreen-btn" onClick={toggleFullscreen}>
      <MdFullscreen />
    </button>
  );
};

export default FullscreenButton;
