import { memo, useState } from "react";
import { FaCheckCircle, FaUserPlus } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";

import { useGlobalStateStore } from "../../../../store";
import { showSuccessToast } from "../../../../utils";
import { useAddUser } from "../../../../hooks";

import SearchBox from "../../../common/searchBox/SearchBox";
import "./addUser.css";

const AddUser = () => {
  const [searchInput, setSearchInput] = useState("");
  const { addMode, setAddMode } = useGlobalStateStore();
  const { allUsers, existingChats, handleAdd } = useAddUser();

  const searchResults = searchInput
    ? allUsers.filter((user) =>
        user.name.toLowerCase().includes(searchInput.toLowerCase())
      )
    : allUsers;

  const handleAddUser = async (user) => {
    try {
      await handleAdd(user); // ✅ Ensure user is added first
      showSuccessToast("User added successfully!");
    } catch (error) {
      console.error("❌ Error adding user:", error);
      showSuccessToast("Failed to add user!");
    }
  };

  return (
    <div className={`addUser ${addMode ? "visible" : "hidden"}`}>
      <div className="header">
        <div className="topBar">
          <MdArrowBack onClick={() => setAddMode(!addMode)} />
          <p>New Chat</p>
        </div>
        <SearchBox input={searchInput} setInput={setSearchInput} />
      </div>

      <div className="user-list">
        {searchResults.map((user) => (
          <div key={user.userId} className="user">
            <div className="addUser-detail">
              <img src={user.profilePic || "/avatar.png"} alt="User Avatar" />
              <span>{user.name || "Unknown User"}</span>
            </div>
            <button
              onClick={() => handleAddUser(user)}
              disabled={existingChats.has(user.userId)}
              className={`add-button ${
                existingChats.has(user.userId) ? "disabled" : ""
              }`}
            >
              {existingChats.has(user.userId) ? (
                <>
                  <FaCheckCircle size={20} />
                  <span>Added</span> {/* ✅ "Added" text के साथ */}
                </>
              ) : (
                <>
                  <FaUserPlus size={20} />
                  <span>Add</span> {/* ✅ "Add" text के साथ */}
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(AddUser);
