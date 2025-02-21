import { MdCameraAlt, MdDone, MdEdit } from "react-icons/md";
import "./Profile.css";
import { useUserStore } from "../../../lib/userStore";
import { useState } from "react";

const Profile = () => {
  const { currentUser } = useUserStore();
  const [profile, setProfile] = useState({
    name: currentUser?.name,
    about: currentUser?.about,
  });
  const { name, about } = profile;

  const [editMode, setEditMode] = useState({
    name: false,
    about: false,
  });
  const { name: editName, about: editAbout } = editMode;

  const [nameLength, setNameLength] = useState(name?.length);
  const [aboutLength, setAboutLength] = useState(about?.length);

  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar({
        file,
        url: URL.createObjectURL(file),
      });
    }
  };

  return (
    <div className="profile">
      <h2 className="title">Profile</h2>
      <div className="profile-content">
        <div className="profile-image">
          <div className="img-wrapper">
            <label htmlFor="profile-pic">
              <MdCameraAlt size={30} />
              <span>
                change <br /> profile picture
              </span>
            </label>
            <input
              type="file"
              id="profile-pic"
              style={{ display: "none" }}
              onChange={handleAvatar}
            />
            {!avatar.url ? (
              <img
                src={currentUser?.profilePic || "./avatar.png"}
                alt="Profile"
              />
            ) : (
              <img src={avatar.url} alt="profile" />
            )}
          </div>
        </div>
        <div className="profile-details">
          <div className="profile-edit">
            <span className="info-text">Your name</span>
            <div className="input-container">
              {editName ? (
                <input
                  type="text"
                  value={name}
                  maxLength={25}
                  disabled={!editName}
                  onChange={(e) => {
                    setProfile({ ...profile, name: e.target.value });
                    setNameLength(e.target.value.length);
                  }}
                  className={editName ? "editedActive" : ""}
                />
              ) : (
                <p>{name}</p>
              )}
              <div className="edit-btn">
                <p>{editName && 25 - nameLength}</p>
                <div
                  className="edit-icon"
                  onClick={() =>
                    setEditMode((prev) => ({ ...prev, name: !prev.name }))
                  }
                >
                  {editName ? <MdDone size={40} /> : <MdEdit />}
                </div>
              </div>
            </div>
          </div>
          <div className="profile-edit about-text">
            <span className="info-text">About</span>
            <div className="input-container">
              {editAbout ? (
                <textarea
                  name="about"
                  id="about"
                  cols="30"
                  rows="3"
                  value={about}
                  maxLength={100}
                  disabled={!editAbout}
                  onChange={(e) => {
                    setProfile({ ...profile, about: e.target.value });
                    setAboutLength(e.target.value.length);
                  }}
                  className={editAbout ? "editedActive" : ""}
                ></textarea>
              ) : (
                <p>{about}</p>
              )}
              <div className="edit-btn">
                <p>{editAbout && 100 - (aboutLength || 0)}</p>
                <div
                  className="edit-icon"
                  onClick={() =>
                    setEditMode((prev) => ({ ...prev, about: !prev.about }))
                  }
                >
                  {editAbout ? <MdDone size={40} /> : <MdEdit />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
