import { FaRegFolderOpen, FaRegTrashAlt } from "react-icons/fa";
import { MdCameraAlt } from "react-icons/md";
import Modal from "../../../common/modal/Modal";
import ProfileMenu from "../ProfileMenu";
import ProfilePreview from "../ProfilePreview";
import { useUserStore } from "../../../../store/userStore";
import { useProfilePicture } from "../../../../utils/profilePictureUtils";
import { useAvatarHoverEffect, useOutsideClickProfilePrev } from "../../../../hooks";
import "./ProfilePicture.css";

const ProfilePicture = () => {
  const { currentUser } = useUserStore();
  const {
    menuOpen,
    setMenuOpen,
    showConfirm,
    isLoading,
    menuPosition,
    avatar,
    avatarRef,
    avatarPreviewRef,
    profilePrvBoxRef,
    handleMenuOpen,
    handleImagePreview,
    handleAvatarChange,
    closeProfileMenu,
    uploadAvatar,
    clearAvatar,
    cancelClearAvatar,
    confirmClearAvatar,
  } = useProfilePicture(currentUser);

  useAvatarHoverEffect(avatarRef, avatar, currentUser);
  useOutsideClickProfilePrev(avatarPreviewRef, profilePrvBoxRef, closeProfileMenu);

  return (
    <div className="profile-image">
      <div className="img-wrapper" onClick={handleMenuOpen}>
        <div
          className={`avatar_overlay  ${
            menuOpen || !currentUser.profilePic ? "active" : ""
          }`}
          ref={avatarRef}
        >
          <MdCameraAlt size={30} />
          {currentUser?.profilePic ? (
            <span>
              Change <br /> profile picture
            </span>
          ) : (
            <span>
              Add profile <br /> picture
            </span>
          )}
        </div>

        <ProfileMenu
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          position={menuPosition}
        >
          <ul>
            <li>
              <label htmlFor="profile-pic" onClick={() => setMenuOpen(false)}>
                <FaRegFolderOpen />
                Upload photo
              </label>
            </li>
            <li onClick={clearAvatar}>
              <FaRegTrashAlt />
              <span>Remove photo</span>
            </li>
          </ul>
        </ProfileMenu>

        <input
          type="file"
          id="profile-pic"
          style={{ display: "none" }}
          onChange={handleImagePreview}
        />
        <img
          src={currentUser?.profilePic || "./default-avatar.png"}
          alt="Profile"
        />
      </div>
      {avatar.url && (
        <ProfilePreview
          avatar={avatar}
          isLoading={isLoading}
          closeProfileMenu={closeProfileMenu}
          uploadAvatar={uploadAvatar}
          handleAvatarChange={handleAvatarChange}
          avatarPreviewRef={avatarPreviewRef}
          profilePrvBoxRef={profilePrvBoxRef}
        />
      )}
      {showConfirm && (
        <Modal
          isOpen={showConfirm}
          onClose={cancelClearAvatar}
          onConfirm={confirmClearAvatar}
          description="Remove your profile picture?"
          confirmText={isLoading ? "Removing..." : "Remove"}
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default ProfilePicture;
