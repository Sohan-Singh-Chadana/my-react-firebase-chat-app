import "./Avatar.css"

const Avatar = ({ chat, currentUser }) => {
  return (
    <div className="avatar-container">
      <img
        src={
          chat.user?.blockedUsers?.includes(currentUser?.uid)
            ? "/default-avatar.png"
            : chat.user?.profilePic || "/default-avatar.png"
        }
        alt="User Avatar"
        className="avatar"
      />
    </div>
  );
};

export default Avatar;
