const ProgressBar = ({ progress, currentTime, duration, handleSeek }) => {
  return (
    <div className="progress-container">
      <span className="time-text">{formatTime(currentTime)}</span>
      <input
        type="range"
        min="0"
        max="100"
        step="0.1"
        value={progress}
        onChange={handleSeek}
        className="progress-bar"
        style={{
          background: `linear-gradient(to right, #fff ${progress}%, #ffffff80 ${progress}%)`,
        }}
      />
      <span className="time-text">{formatTime(duration)}</span>
    </div>
  );
};

// ✅ Format Time (HH:MM:SS)
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default ProgressBar;
