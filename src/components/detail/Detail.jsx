import { useState } from "react";
import {
  MdBlock,
  MdClose,
  MdDelete,
  MdFileDownload,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";

import { deleteSingleChat } from "../../utils";
import { useChatStore, useGlobalStateStore } from "../../store";

import DeleteChatsModal from "../common/DeleteChatsModal";
import BlockAction from "../common/BlockAction";
import "./detail.css";

const Detail = () => {
  const { user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
  const [openSection, setOpenSection] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { showDetail, setShowDetail } = useGlobalStateStore();

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleDeleteChat = () => {
    deleteSingleChat();
    setShowDelete(false);
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
            onClick={!isCurrentUserBlocked ? () => setShowConfirm(true) : null} // Disable click if blocked
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
          <button className="delete-chat" onClick={() => setShowDelete(true)}>
            <MdDelete />
            <span>Delete Chat</span>
          </button>
        </div>
      </div>

      {showConfirm && (
        <BlockAction
          showConfirm={showConfirm}
          setShowConfirm={setShowConfirm}
        />
      )}

      {showDelete && (
        <DeleteChatsModal
          isOpen={showDelete}
          setIsOpen={setShowDelete}
          onConfirm={handleDeleteChat}
        />
      )}
    </div>
  );
};

export default Detail;
