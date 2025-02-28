import {
  arrayRemove,
  arrayUnion,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useChatStore } from "../../store/chatStore";
import { useUserStore } from "../../store/userStore";
import { useState } from "react";
import "./detail.css";
import {
  MdBlock,
  MdClose,
  MdDelete,
  MdFileDownload,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import Modal from "../common/modal/Modal";
import useGlobalStateStore from "../../store/globalStateStore";
import { auth, db } from "../../lib/firebase/firebase";

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();
  const { currentUser } = useUserStore();
  const [openSection, setOpenSection] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { showDetail, setShowDetail } = useGlobalStateStore();

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleBlock = () => {
    setShowConfirm(true);
  };

  const cancelBlocked = () => {
    setShowConfirm(false);
  };

  const confirmBlocked = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", currentUser.userId);

    try {
      await updateDoc(userDocRef, {
        blockedUsers: isReceiverBlocked
          ? arrayRemove(user.userId)
          : arrayUnion(user.userId),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
    setShowConfirm(false);
  };

  const handleDeleteChat = async () => {
    // if (!chatId) return;
    // try {
    //   await deleteDoc(doc(db, "chats", chatId));
    //   alert("Chat deleted successfully!");
    //   onClose();
    // } catch (err) {
    //   console.log("Error deleting chat:", err);
    // }
  };

  return (
    <div className={`detail ${showDetail ? "show" : ""}`}>
      <div className="header">
        <MdClose onClick={() => setShowDetail(false)} />
        <p>Contact info</p>
      </div>
      <div className="user">
        <img src={user?.profilePic || "/default-avatar.png"} alt="avatar" />
        <h2>{isCurrentUserBlocked ? "Unknown User" : user?.name}</h2>
        <p>
          {isReceiverBlocked || isCurrentUserBlocked
            ? ""
            : user?.about || "No bio available"}
        </p>
      </div>
      <div className="info">
        {/* Chat Settings */}
        <div className="option">
          <div className="title" onClick={() => toggleSection("chat")}>
            <span>Chat Settings</span>
            {openSection === "chat" ? (
              <MdKeyboardArrowDown />
            ) : (
              <MdKeyboardArrowUp />
            )}
          </div>
          {openSection === "chat" && (
            <div className="content">
              <p>🔹 Change chat background</p>
              <p>🔹 Enable/Disable read receipts</p>
              <p>🔹 Adjust font size</p>
            </div>
          )}
        </div>

        {/* Privacy & Help */}
        <div className="option">
          <div className="title" onClick={() => toggleSection("privacy")}>
            <span>Privacy & Help</span>
            {openSection === "privacy" ? (
              <MdKeyboardArrowDown />
            ) : (
              <MdKeyboardArrowUp />
            )}
          </div>
          {openSection === "privacy" && (
            <div className="content">
              <p>🔹 Manage blocked users</p>
              <p>🔹 Two-step verification</p>
              <p>🔹 Contact support</p>
            </div>
          )}
        </div>

        {/* Shared Photos */}
        <div className="option">
          <div className="title" onClick={() => toggleSection("photos")}>
            <span>Shared Photos</span>
            {openSection === "photos" ? (
              <MdKeyboardArrowDown />
            ) : (
              <MdKeyboardArrowUp />
            )}
          </div>
          {openSection === "photos" && (
            <div className="content photos">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="photoItem">
                  <div className="photoDetail">
                    <img
                      src="https://images.pexels.com/photos/6347788/pexels-photo-6347788.png"
                      alt=""
                    />
                    <span>photo_{index + 1}.png</span>
                  </div>
                  <MdFileDownload className="icon" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shared Files */}
        <div className="option">
          <div className="title" onClick={() => toggleSection("files")}>
            <span>Shared Files</span>
            {openSection === "files" ? (
              <MdKeyboardArrowDown />
            ) : (
              <MdKeyboardArrowUp />
            )}
          </div>
          {openSection === "files" && (
            <div className="content photos">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="photoItem">
                  <div className="photoDetail">
                    <img
                      src="https://images.pexels.com/photos/6347788/pexels-photo-6347788.png"
                      alt="File"
                    />
                    <span>document_{index + 1}.pdf</span>
                  </div>
                  <MdFileDownload className="icon" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="btn-container">
          <button
            onClick={!isCurrentUserBlocked ? handleBlock : null} // Disable click if blocked
            disabled={isCurrentUserBlocked} // Disable button for blocked users
            style={{
              color: isReceiverBlocked ? "#419e51" : "var(--red-color)",
              cursor: isCurrentUserBlocked ? "not-allowed" : "pointer",
              opacity: isCurrentUserBlocked ? 0.5 : 1, // Make it visually disabled
            }}
          >
            <MdBlock />
            <span>
              {isCurrentUserBlocked
                ? "You are Blocked!"
                : isReceiverBlocked
                ? `Unblock ${user?.name}`
                : `Block ${user?.name}`}
            </span>
          </button>
          <button className="delete-chat" onClick={handleDeleteChat}>
            <MdDelete />
            <span>Delete Chat</span>
          </button>
        </div>
      </div>
      {showConfirm && (
        <Modal
          isOpen={showConfirm}
          onClose={cancelBlocked}
          onConfirm={confirmBlocked}
          title={`${
            !(isCurrentUserBlocked || isReceiverBlocked) ? "Block" : "Unblock"
          }  ${user?.name}?`}
          description={`Are you sure you want to ${
            !(isCurrentUserBlocked || isReceiverBlocked) ? "block" : "unblock"
          } ${user?.name}? This action is irreversible.`}
          confirmText={`${
            !(isCurrentUserBlocked || isReceiverBlocked) ? "Block" : "Unblock"
          }`}
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default Detail;
