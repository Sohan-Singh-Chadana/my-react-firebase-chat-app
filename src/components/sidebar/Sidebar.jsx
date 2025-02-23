import { MdChat, MdSettings } from "react-icons/md";
import List from "../list/List";
import "./sidebar.css";
import { IoSettingsOutline } from "react-icons/io5";
import { BsChatLeftText } from "react-icons/bs";
import { useUserStore } from "../../lib/userStore";
import { useState } from "react";
import Settings from "./Setting";
import Profile from "./Profile";

export const Sidebar = () => {
  const { currentUser, isLoading } = useUserStore();
  const [visibleComponent, setVisibleComponent] = useState({
    list: true,
    settings: false,
    profile: false,
  });
  const { list, settings, profile } = visibleComponent;

  const toggleComponent = (component) => {
    setVisibleComponent({
      list: component === "list",
      settings: component === "settings",
      profile: component === "profile",
    });
  };

  return (
    <div className="sidebar">
      <div className="miniSidebar">
        <div className="top-menu">
          <div
            className={`icon ${list ? "active" : ""}`}
            onClick={() => toggleComponent("list")}
          >
            {list ? <MdChat /> : <BsChatLeftText />}
          </div>
        </div>
        <div className="bottom-menu">
          <div
            className={`icon ${settings ? "active" : ""}`}
            onClick={() => toggleComponent("settings")}
          >
            {settings ? <MdSettings /> : <IoSettingsOutline />}
          </div>
          <figure
            className={`avatar ${profile ? "active" : ""}`}
            onClick={() => toggleComponent("profile")}
          >
            <img
              src={currentUser?.profilePic || "/default-avatar.png"}
              alt=""
            />
          </figure>
        </div>
      </div>
      {visibleComponent.list && <List />}
      {visibleComponent.settings && <Settings />}
      {visibleComponent.profile && <Profile />}
    </div>
  );
};
