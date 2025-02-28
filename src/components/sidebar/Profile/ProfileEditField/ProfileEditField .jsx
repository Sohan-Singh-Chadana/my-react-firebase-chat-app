import { MdDone, MdEdit, MdHourglassEmpty } from "react-icons/md";
import "./ProfileEditField.css";

const ProfileEditField = ({
  label,
  value,
  isEditing,
  maxLength,
  onChange,
  isLoading,
  onEdit,
  isTextarea,
}) => {
  return (
    <div className="profile-edit">
      <span className="info-text">{label}</span>
      <div className="input-container">
        {isEditing ? (
          isTextarea ? (
            <textarea
              name="about"
              id="about"
              cols="30"
              rows="3"
              value={value}
              maxLength={maxLength}
              disabled={!isEditing}
              onChange={onChange}
              className={isEditing ? "editedActive" : ""}
            ></textarea>
          ) : (
            <input
              type="text"
              value={value}
              maxLength={maxLength}
              disabled={!isEditing}
              onChange={onChange}
              className={isEditing ? "editedActive" : ""}
            />
          )
        ) : (
          <p>{value}</p>
        )}
        <div className="edit-btn">
          <p>{isEditing && maxLength - (value?.length || 0)}</p>
          <div className="edit-icon" onClick={onEdit}>
            {isEditing ? (
              isLoading ? (
                <MdHourglassEmpty size={40} className="rotate-icon" />
              ) : (
                <MdDone size={40} />
              )
            ) : (
              <MdEdit />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditField;
