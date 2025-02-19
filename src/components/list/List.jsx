import ChatList from "./chatList/ChatList";
import ChatListHeader from "./chatListHeader/ChatListHeader";
import "./list.css";
import Userinfo from "./userInfo/Userinfo";

const List = () => {
  return (
    <>
      <div className="list">
        {/* <Userinfo /> */}
        <ChatListHeader />
        <ChatList />
      </div>
    </>
  );
};

export default List;
