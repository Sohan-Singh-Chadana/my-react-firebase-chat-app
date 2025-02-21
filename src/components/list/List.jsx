import ChatList from "./chatList/ChatList";
import ChatListHeader from "./chatListHeader/ChatListHeader";
import "./list.css";

const List = () => {
  return (
    <>
      <div className="list">
        <ChatListHeader />
        <ChatList />
      </div>
    </>
  );
};

export default List;
