import { FaPause, FaPlay } from "react-icons/fa";

const PlayPauseButton = ({ isPlaying, togglePlayPause }) => {
  return (
    <button
      className="control-btn"
      onClick={(e) => {
        e.stopPropagation();
        togglePlayPause();
      }}
    >
      {isPlaying ? <FaPause /> : <FaPlay />}
    </button>
  );
};

export default PlayPauseButton;
