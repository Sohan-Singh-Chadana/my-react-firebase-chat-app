import "./ImageLoader.css";

const ImageLoader = ({
  width = "100px",
  height = "100px",
  spinnerSize = "24px",
  borderRadius = "50%",
  className = "",
  classNameSpinner = "",
}) => {
  return (
    <div
      className="image-container-loader"
      style={{ width, height, borderRadius }}
    >
      <div className={`loading-spinner ${className}`}>
        <span
          className={`spinner ${classNameSpinner}`}
          style={{ width: spinnerSize, height: spinnerSize }}
        ></span>
      </div>
    </div>
  );
};

export default ImageLoader;
