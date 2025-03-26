import { MdClose, MdDownload } from "react-icons/md";
import PropTypes from "prop-types";
import { useChatStore, useUserStore } from "../../../../../../../store";
import {
  formatChatImagePreviewTimestamp,
  handleMediaDownload,
} from "../../../../../../../utils";
import "./ImagePreviewHeader.css";

const ImagePreviewHeader = ({ currentImage, setIsPreviewOpen }) => {
  const { user, isCurrentUserBlocked } = useChatStore();
  const { currentUser } = useUserStore();

  const timestampText = formatChatImagePreviewTimestamp(
    currentImage?.timestamp?.seconds
  );
  const userNameText = isCurrentUserBlocked
    ? "Unknown User"
    : currentImage?.senderId === currentUser.userId
    ? "You"
    : user?.name;

  const userProfilePic =
    currentImage?.senderId === currentUser.userId
      ? currentUser?.profilePic || "/default-avatar.png"
      : user?.profilePic || "/default-avatar.png";

  return (
    <div className="preview-content-header">
      <div className="user">
        <img src={userProfilePic} alt="avatar" />
        <div className="user-info">
          {userNameText && <span className="name">{userNameText}</span>}
          <span className="message_timestamp">{timestampText}</span>
        </div>
      </div>
      <div className="actions-btn">
        <button
          className="download-btn"
          onClick={() =>
            handleMediaDownload(currentImage?.media, currentImage?.mediaType)
          }
        >
          <MdDownload size={24} />
        </button>
        <button className="close-btn" onClick={() => setIsPreviewOpen(false)}>
          <MdClose size={24} />
        </button>
      </div>
    </div>
  );
};

ImagePreviewHeader.propTypes = {
  currentImage: PropTypes.object,
  setIsPreviewOpen: PropTypes.func.isRequired,
};

export default ImagePreviewHeader;
