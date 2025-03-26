import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const VolumeControl = ({ toggleMute, isMuted, volume, handleVolumeChange }) => {
  return (
    <div className="volume-container">
      <button className="control-btn" onClick={toggleMute}>
        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
      </button>
      {/* ✅ Volume Slider */}
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={handleVolumeChange}
        className="volume-slider"
        style={{
          background: `linear-gradient(to right, #fff ${
            volume * 100
          }%, #ffffff80 ${volume * 100}%)`,
        }}
      />
    </div>
  );
};

export default VolumeControl;
