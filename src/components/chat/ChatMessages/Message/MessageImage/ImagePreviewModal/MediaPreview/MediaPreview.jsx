import { useEffect, useRef, useState } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import PictureInPictureButton from "./PictureInPictureButton/PictureInPictureButton";
import FullscreenButton from "./FullscreenButton/FullscreenButton";
import PlayPauseButton from "./PlayPauseButton/PlayPauseButton";
import "./MediaPreview.css";
import ProgressBar from "./ProgressBar/ProgressBar";
import VolumeControl from "./VolumeControl/VolumeControl";

const MediaPreview = ({ currentImage, handleImageZoomOpen }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [lastVolume, setLastVolume] = useState(1);
  const [showOverlay, setShowOverlay] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  let inactivityTimer = useRef(null);

  // ✅ Play/Pause Toggle
  const togglePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // ✅ Set initial mute state based on video volume
  useEffect(() => {
    if (videoRef.current) {
      const initialVolume = videoRef.current.volume;
      setVolume(initialVolume);
      setIsMuted(initialVolume === 0);
    }
  }, []);

  // ✅ Handle Mute/Unmute Properly
  const toggleMute = () => {
    if (!videoRef.current.muted) {
      setLastVolume(volume);
      videoRef.current.muted = true;
      setIsMuted(true);
      setVolume(0);
    } else {
      videoRef.current.muted = false;
      setIsMuted(false);

      // ✅ Check if lastVolume is 0, set to 1 if true
      const restoredVolume = lastVolume === 0 ? 0.2 : lastVolume;
      setVolume(restoredVolume);
      videoRef.current.volume = restoredVolume;
    }
  };

  // ✅ Change Volume
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  // ✅ Picture-in-Picture (PiP)
  const togglePictureInPicture = async () => {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else if (videoRef.current.requestPictureInPicture) {
      await videoRef.current.requestPictureInPicture();
    }
  };

  // ✅ Enable Fullscreen
  const toggleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.mozRequestFullScreen()) {
      videoRef.current.mozRequestFullScreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    } else if (videoRef.current.msRequestFullscreen) {
      videoRef.current.msRequestFullscreen();
    }
  };

  // ✅ Handle Video Progress Update
  const handleTimeUpdate = () => {
    const current = videoRef.current?.currentTime;
    const duration = videoRef.current?.duration;
    const percentage = (current / duration) * 100;
    setCurrentTime(current);
    setDuration(duration);
    setProgress(percentage);

    if (current === duration) {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, []);

  // ✅ Seek Video Progress
  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setProgress(e.target.value);
  };

  // ✅ Reset Inactivity Timer on User Interaction
  const resetInactivityTimer = () => {
    setShowOverlay(true); // Show overlay on mouse movement
    clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      setShowOverlay(false); // Hide overlay after 5s of inactivity
    }, 5000);
  };

  // ✅ Set Inactivity Timer on Mount
  useEffect(() => {
    resetInactivityTimer(); // Initial timer setup
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("touchmove", resetInactivityTimer);

    return () => {
      clearTimeout(inactivityTimer.current);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("touchmove", resetInactivityTimer);
    };
  }, []);

  // 🎥 Hide loader when video loads
  const handleVideoLoad = () => {
    setIsVideoLoading(false);
  };

  useEffect(() => {
    setProgress(0); // ✅ Reset progress when video changes
    setIsVideoLoading(true); // Reset loading state on video change
    setIsPlaying(true); // Reset playing state on video change
  }, [currentImage]); // 🎥 Run when the video changes

  return (
    <figure className="media-container">
      {currentImage.mediaType === "image" ? (
        <img
          src={currentImage.media}
          alt="Preview"
          onClick={handleImageZoomOpen}
        />
      ) : currentImage.mediaType === "video" ? (
        <div className="video-wrapper">
          {/* ✅ Show Loader While Video Loads */}
          {isVideoLoading && (
            <div className="video-loader">
              <div className="spinner"></div>
            </div>
          )}

          {/* ✅ Display Video */}
          <video
            ref={videoRef}
            autoPlay={true}
            controls={false}
            src={currentImage.media}
            onClick={(e) => e.stopPropagation()}
            onLoadedMetadata={handleVideoLoad}
            onTimeUpdate={handleTimeUpdate}
            className={`custom-video ${isVideoLoading ? "hidden" : ""}`} // Hide video until loaded
          />
          {/* // ✅ Overlay */}
          {showOverlay && !isVideoLoading && (
            <div
              className="video-overlay"
              onClick={(e) => {
                e.stopPropagation();
                if (e.target === e.currentTarget) {
                  togglePlayPause();
                }
              }}
            >
              {/* ✅ Picture-in-Picture Button */}
              <PictureInPictureButton
                togglePictureInPicture={togglePictureInPicture}
              />

              {/* ✅ Fullscreen Button */}
              <FullscreenButton toggleFullscreen={toggleFullscreen} />

              <div className="video-controls">
                {/* ✅ Play/Pause Button */}
                <PlayPauseButton
                  isPlaying={isPlaying}
                  togglePlayPause={togglePlayPause}
                />

                {/* ✅ Video Progress Bar */}
                <ProgressBar
                  progress={progress}
                  currentTime={currentTime}
                  duration={duration}
                  handleSeek={handleSeek}
                />

                {/* Volume Control Bar */}
                <VolumeControl
                  volume={volume}
                  isMuted={isMuted}
                  toggleMute={toggleMute}
                  handleVolumeChange={handleVolumeChange}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>Unsupported media type</div>
      )}
    </figure>
  );
};

export default MediaPreview;
