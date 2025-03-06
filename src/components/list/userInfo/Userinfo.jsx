import { useUserStore } from "../../../store";
import "./userInfo.css";

const Userinfo = () => {
  const { currentUser } = useUserStore();

  return (
    <div className="userInfo">
      <div className="user">
        <img src={currentUser.avatar || "/avatar.png"} alt="User Avatar" />
        <div className="info">
          <h2>{currentUser.username}</h2>
          <p>Lorem ipsum dolor sit amet.</p>
        </div>
      </div>
    </div>
  );
};

export default Userinfo;
