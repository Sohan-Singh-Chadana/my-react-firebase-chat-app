import { MdPictureInPicture } from "react-icons/md";

const PictureInPictureButton = ({ togglePictureInPicture }) => {
  return (
    <button
      className="control-btn pictureInPictureBtn "
      onClick={togglePictureInPicture}
    >
      <MdPictureInPicture />
    </button>
  );
};

export default PictureInPictureButton;
