import { useState } from "react";
import { MdWarningAmber } from "react-icons/md";
import ProfileEditField from "./ProfileEditField";
import ProfilePicture from "./ProfilePicture";
import { handleProfileUpdate } from "../../../utils/profileUtils";
import { useUserStore } from "../../../store/userStore";
import "./Profile.css";
import { FaArrowLeftLong } from "react-icons/fa6";

const Profile = ({ showBackButton = false, onBack = () => {} }) => {
  const { currentUser } = useUserStore();
  const [isLoadingName, setIsLoadingName] = useState(false);
  const [isLoadingAbout, setIsLoadingAbout] = useState(false);

  const [profile, setProfile] = useState({
    name: currentUser?.name,
    about: currentUser?.about,
  });

  const [editMode, setEditMode] = useState({
    name: false,
    about: false,
  });

  const { name, about } = profile;
  const { name: editName, about: editAbout } = editMode;

  const updateProfile = (field) => {
    handleProfileUpdate({
      field,
      value: field === "name" ? name : about,
      setIsLoading: field === "name" ? setIsLoadingName : setIsLoadingAbout,
      setEditMode,
      currentUser,
    });
  };

  return (
    <div className="profile">
      <header className="profile-header">
        {showBackButton && (
          <button onClick={onBack} className="back-button">
            <FaArrowLeftLong size={20} />
          </button>
        )}
        <h2
          className={`${showBackButton ? "smallTitle" : "title"}`}
        >
          Profile
        </h2>
      </header>

      <div className="profile-content">
        <ProfilePicture />
        <div className="profile-details">
          <ProfileEditField
            label="Your name"
            value={name}
            isEditing={editName}
            maxLength={25}
            isLoading={isLoadingName}
            isTextarea={false}
            onChange={(e) => {
              setProfile({ ...profile, name: e.target.value });
            }}
            onEdit={() =>
              editName
                ? updateProfile("name")
                : setEditMode((prev) => ({ ...prev, name: !prev.name }))
            }
          />
          <p className="warn-text">
            <MdWarningAmber size={15} />
            Heads up! Your new username will be visible in all your chats, even
            older ones. Pick wisely!
          </p>
          <ProfileEditField
            label="About"
            value={about}
            isEditing={editAbout}
            isLoading={isLoadingAbout}
            maxLength={100}
            isTextarea={true}
            onChange={(e) => {
              setProfile({ ...profile, about: e.target.value });
            }}
            onEdit={() =>
              editAbout
                ? updateProfile("about")
                : setEditMode((prev) => ({ ...prev, about: !prev.about }))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
