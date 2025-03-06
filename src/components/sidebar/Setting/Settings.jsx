import { createElement, useState } from "react";
import {
  MdAccountCircle,
  MdChatBubbleOutline,
  MdHelpOutline,
  MdKeyboard,
  MdLock,
  MdLogout,
  MdNotificationsActive,
} from "react-icons/md";
import SearchBox from "../../common/searchBox/SearchBox";
import Profile from "../Profile";
import settingComponents from "./settingComponents";
import { settingListData } from "./settingListData";
import Logout from "../../common/Logout";
import { useUserStore } from "../../../store";
import "./Settings.css";

const iconMap = {
  MdAccountCircle,
  MdLock,
  MdChatBubbleOutline,
  MdNotificationsActive,
  MdKeyboard,
  MdHelpOutline,
  MdLogout,
};

const Settings = () => {
  const { currentUser } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");

  const [visibleSection, setVisibleSection] = useState(null);

  // Toggle function
  const toggleSection = (section) => {
    setVisibleSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="settings">
      <header className="setting-header">
        <h2 className="main-title">Settings</h2>
        <SearchBox input={searchQuery} setInput={setSearchQuery} />
      </header>

      <div className="userInfo" onClick={() => toggleSection("profile")}>
        <figure className="user-avatar">
          <img
            src={currentUser.profilePic || "default-avatar.png"}
            alt="avatar"
          />
        </figure>
        <h4 className="userName">{currentUser.name}</h4>
      </div>

      <ul className="settingList">
        {settingListData &&
          settingListData.map(({ id, icon, name }) => {
            const IconComponent = iconMap[icon];
            const isLogout = name === "Logout";
            const KeyboardShortcuts = name === "KeyboardShortcuts";
            const ChatSetting = name === "ChatSetting";
            return (
              <li
                className={`settingItem ${isLogout ? "logoutItem" : ""}`}
                key={id}
                onClick={() => !isLogout && toggleSection(name)}
              >
                <div className="settingIcon">
                  {IconComponent && <IconComponent size={25} />}
                </div>
                {isLogout ? (
                  <Logout className="settingName" />
                ) : (
                  <span className="settingName">
                    {KeyboardShortcuts
                      ? "Keyboard Shortcuts"
                      : ChatSetting
                      ? "Chats"
                      : name}
                  </span>
                )}
              </li>
            );
          })}
      </ul>

      {/* list Setting Section   */}
      <div className={`settingContainer ${visibleSection ? "show" : ""}`}>
        {settingComponents[visibleSection] &&
          createElement(settingComponents[visibleSection], {
            onBack: () => setVisibleSection(null),
          })}
      </div>

      {/* Profile Section */}
      <div
        className={`profileContainer ${
          visibleSection === "profile" ? "show" : ""
        }`}
      >
        <Profile showBackButton={true} onBack={() => setVisibleSection(null)} />
      </div>
    </div>
  );
};

export default Settings;
