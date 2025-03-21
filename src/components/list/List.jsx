import ChatListHeader from "./chatListHeader/ChatListHeader";
import ChatList from "./chatList/ChatList";
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
