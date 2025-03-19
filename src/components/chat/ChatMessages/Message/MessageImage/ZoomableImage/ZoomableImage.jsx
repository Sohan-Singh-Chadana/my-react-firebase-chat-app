import { useRef, useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import "./ZoomableImage.css";

const ZoomableImage = ({ src, onClose }) => {
  const [isZoomed, setIsZoomed] = useState(false); // ❌ Default false for animation
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);

  useEffect(() => {
    // ✅ Delay zoom effect for smooth opening
    setTimeout(() => setIsZoomed(true), 50);
  }, []);

  const handleMouseMove = (e) => {
    if (!isZoomed) return;

    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setPosition({ x, y });
  };

  return (
    <div className="fullscreen-overlay" onClick={onClose}>
      <div
        className="zoom-container"
        ref={containerRef}
        onMouseMove={handleMouseMove}
      >
        <img
          src={src}
          alt="Zoomed"
          className={`zoom-image ${isZoomed ? "zoomed" : ""}`}
          style={{
            transform: isZoomed
              ? `scale(2) translate(${50 - position.x}%, ${50 - position.y}%)`
              : "scale(1)",
            objectFit: "contain",
          }}
          onClick={() => setIsZoomed(!isZoomed)}
        />
      </div>
      <button className="close-btn" onClick={onClose}>
        <MdClose size={28} />
      </button>
    </div>
  );
};

export default ZoomableImage;
