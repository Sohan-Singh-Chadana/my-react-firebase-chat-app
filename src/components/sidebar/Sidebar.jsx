import { MdChat, MdSettings } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { BsChatLeftText } from "react-icons/bs";
import { useUserStore, useVisibleComponentStore } from "../../store";
import List from "../list/List";
import Settings from "./Setting";
import Profile from "./Profile";
import "./sidebar.css";

const Sidebar = () => {
  const { currentUser } = useUserStore();
  const { visibleComponent, toggleComponent } = useVisibleComponentStore();
  const { list, settings, profile } = visibleComponent;

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

export default Sidebar;
