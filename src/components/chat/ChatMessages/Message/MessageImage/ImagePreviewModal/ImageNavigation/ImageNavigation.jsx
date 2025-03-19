import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import PropTypes from "prop-types";
import "./ImageNavigation.css";

const ImageNavigation = ({
  handlePrevImage,
  handleNextImage,
  imageIndex,
  totalImages,
}) => {
  return (
    <>
      <button
        className="prevBtn"
        onClick={handlePrevImage}
        disabled={imageIndex === 0}
      >
        <FaAngleLeft size={24} />
      </button>
      <button
        className="nextBtn"
        onClick={handleNextImage}
        disabled={imageIndex === totalImages - 1}
      >
        <FaAngleRight size={24} />
      </button>
    </>
  );
};

ImageNavigation.propTypes = {
  handlePrevImage: PropTypes.func.isRequired,
  handleNextImage: PropTypes.func.isRequired,
  imageIndex: PropTypes.number.isRequired,
  totalImages: PropTypes.number.isRequired,
};

export default ImageNavigation;
