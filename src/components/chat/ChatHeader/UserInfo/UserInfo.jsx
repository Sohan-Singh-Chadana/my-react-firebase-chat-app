import { useTypingStatusListener, useUserStatus } from "../../../../hooks";
import { useChatStore, useGlobalStateStore } from "../../../../store";
import { formatLastSeen } from "../../../../utils";

const UserInfo = () => {
  const { user, isReceiverBlocked, isCurrentUserBlocked } = useChatStore();
  const userStatus = useUserStatus();
  const typingStatus = useTypingStatusListener();
  const { setShowDetail } = useGlobalStateStore();

  const userStatusText =
    isReceiverBlocked || isCurrentUserBlocked ? null : userStatus.status ===
      "online" ? (
      <span className="online-status">
        {typingStatus?.isTyping ? "Typing..." : "Online"}
      </span>
    ) : userStatus.lastSeen ? (
      <span className="last-seen">{formatLastSeen(userStatus.lastSeen)}</span>
    ) : (
      <span className="offline-status">Offline</span>
    );

  const userNameText = isCurrentUserBlocked ? "Unknown User" : user?.name;

  return (
    <div className="user" onClick={() => setShowDetail(true)}>
      <img src={user?.profilePic || "/default-avatar.png"} alt="" />
      <div className="user-info">
        {userNameText && <span className="name">{userNameText}</span>}
        {userStatusText && userStatusText}
      </div>
    </div>
  );
};

export default UserInfo;
