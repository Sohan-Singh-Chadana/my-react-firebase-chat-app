import List from "../list/List";
import "./sidebar.css";

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="miniSidebar">
        <img src="/avatar.png" alt="" />
      </div>
      <List />
    </div>
  );
};
