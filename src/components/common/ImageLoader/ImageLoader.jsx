import "./ImageLoader.css";

const ImageLoader = ({
  width = "100px",
  height = "100px",
  spinnerSize = "24px",
  borderRadius = "50%",
}) => {
  return (
    <div className="image-container" style={{ width, height, borderRadius }}>
      <div className="loading-spinner">
        <span
          className="spinner"
          style={{ width: spinnerSize, height: spinnerSize }}
        ></span>
      </div>
    </div>
  );
};

export default ImageLoader;
