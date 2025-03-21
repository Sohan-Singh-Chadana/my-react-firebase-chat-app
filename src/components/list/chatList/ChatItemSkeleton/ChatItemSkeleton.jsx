import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // ✅ Correct import
import "./ChatItemSkeleton.css"; // ✅ Your custom styles

const ChatItemSkeleton = () => {
  return (
    <div className="chat-item-skeleton">
      <div className="chat-content-skeleton">
        <Skeleton
          width={50}
          height={50}
          style={{ borderRadius: "50%", marginLeft: "15px" }}
        />

        <div className="chat-info-skeleton">
          {/* <div className="name-skeleton">
            <Skeleton width={150} height={20} />
            <Skeleton width={100} height={20} />
          </div>
          <Skeleton width={"98%"} height={20} /> */}
          <Skeleton width={"98%"} height={60} />
        </div>
      </div>
    </div>
  );
};

export default ChatItemSkeleton;
