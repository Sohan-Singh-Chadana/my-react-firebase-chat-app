import PropTypes from "prop-types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en"; // English locale (optional)
import { MdLocalPhone, MdVideocam } from "react-icons/md";
import MenuContainer from "../../common/menuContainer/MenuContainer";
import useMenuStore from "../../store/menuStore";
import "./ChatHeader.css";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale("en"); // Set locale to English

const ChatHeader = ({ user, userStatus, typingStatus, setShowDetail }) => {
  const { setMenuOpen } = useMenuStore();
  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return "Offline";

    const now = dayjs();
    const lastSeenDate = dayjs(lastSeen);

    if (lastSeenDate.isSame(now, "day")) {
      return `Last seen Today at ${lastSeenDate.format("h:mm A")}`;
    } else if (lastSeenDate.isSame(now.subtract(1, "day"), "day")) {
      return `Last seen Yesterday at ${lastSeenDate.format("h:mm A")}`;
    } else {
      return `Last seen on ${lastSeenDate.format("DD/MM/YYYY [at] h:mm A")}`;
    }
  };

  // handle contact info
  const handleContactInfo = () => {
    setShowDetail(true);
    setMenuOpen("actionMenuInChatTop", false);
  };

  return (
    <div className="top">
      <div className="user" onClick={() => setShowDetail(true)}>
        <img src={user?.profilePic || "/avatar.png"} alt="" />
        <div className="user-info">
          <span className="name">{user?.name}</span>
          {userStatus.status === "online" ? (
            <span className="online-status">
              {!typingStatus?.isTyping ? "Online" : "Typing..."}
            </span>
          ) : userStatus.lastSeen ? (
            <span className="last-seen">
              {formatLastSeen(userStatus.lastSeen)}
            </span>
          ) : (
            <span className="offline-status">Offline</span>
          )}
        </div>
      </div>
      <div className="icons">
        <div className="icon">
          <MdLocalPhone />
        </div>
        <div className="icon">
          <MdVideocam />
        </div>
        <MenuContainer
          menuId="actionMenuInChatTop"
          iconClass="icon"
          menuClass="modify-menu"
        >
          <button onClick={handleContactInfo}>Contact info</button>
          <button>Select messages</button>
          <button>Add To favorites</button>
          <button>Close chat</button>
          <button>Block</button>
          <button>Clear chat</button>
          <button>Delete chat</button>
        </MenuContainer>
      </div>
    </div>
  );
};

// Props validation
ChatHeader.propTypes = {
  user: PropTypes.shape({
    profilePic: PropTypes.string,
    name: PropTypes.string.isRequired,
  }).isRequired,
  userStatus: PropTypes.shape({
    status: PropTypes.oneOf(["online", "offline"]).isRequired,
    lastSeen: PropTypes.instanceOf(Date),
  }).isRequired,
  typingStatus: PropTypes.shape({
    isTyping: PropTypes.bool,
  }),
  setShowDetail: PropTypes.func.isRequired,
};

export default ChatHeader;
