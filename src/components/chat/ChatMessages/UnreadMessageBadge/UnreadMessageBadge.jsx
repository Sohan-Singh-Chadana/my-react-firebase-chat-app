const UnreadMessageBadge = ({ unreadCount }) => {
  if (unreadCount <= 0) return null;

  return (
    <div className="unread-badge">
      <span className="unread-count">
        {unreadCount} unread {unreadCount > 1 ? "messages" : "message"}
      </span>
    </div>
  );
};

export default UnreadMessageBadge;
