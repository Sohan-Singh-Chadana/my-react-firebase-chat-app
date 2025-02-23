import { MdClose, MdDone, MdHourglassEmpty } from "react-icons/md";
import { LuUndo2 } from "react-icons/lu";
import ImageLoader from "../../../common/ImageLoader";
import "./ProfilePreview.css";

const ProfilePreview = ({
  isLoading,
  avatar,
  avatarPreviewRef,
  profilePrvBoxRef,
  handleAvatarChange,
  closeProfileMenu,
  uploadAvatar,
}) => {
  return (
    <div className="profile-preview" ref={avatarPreviewRef}>
      <div className="pro-prev-box" ref={profilePrvBoxRef}>
        {isLoading ? (
          <ImageLoader width="350px" height="350px" spinnerSize="100px" />
        ) : (
          <img src={avatar?.url} alt="profile" />
        )}
        <div className="profile-edit-closeIcon">
          <MdClose onClick={closeProfileMenu} />
          <div className="undo-text" onClick={uploadAvatar}>
            <LuUndo2 />
            <span>Upload</span>
          </div>
        </div>
        <div className="profile-edit-doneIcon" onClick={handleAvatarChange}>
          {isLoading ? (
            <MdHourglassEmpty size={40} className="rotate-icon" />
          ) : (
            <MdDone />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;
