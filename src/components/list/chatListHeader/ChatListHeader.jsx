import { useState } from "react";
import { MdClose, MdOutlineChat } from "react-icons/md";

import MenuContainer from "../../common/menuContainer/MenuContainer";
import DeleteChatsModal from "../../common/DeleteChatsModal";
import SearchBox from "../../common/searchBox/SearchBox";
import Logout from "../../common/Logout";

import {
  useGlobalStateStore,
  useMenuStore,
  useSelectChats,
} from "../../../store";

import { chatDeletionUtils } from "../../../utils";
import "./chatListHeader.css";

const ChatListHeader = () => {
  const {
    addMode,
    setAddMode,
    selectMode,
    setSelectMode,
    searchInput,
    setSearchInput,
  } = useGlobalStateStore();
  const { selectedChats, clearSelectedChats } = useSelectChats();
  const { setMenuOpen } = useMenuStore();

  const [confirmDelete, setConfirmDelete] = useState(false);

  // Toggle chat selection mode
  const handleSelectChats = () => {
    setSelectMode(!selectMode);
    setMenuOpen("actionMenuInChatList", false); // Close menu after selecting
  };

  const handleDeleteChats = () => {
    chatDeletionUtils();
    setConfirmDelete(false);
  };

  const handleCancelSelect = () => {
    clearSelectedChats();
    setSelectMode(false);
  };

  return (
    <div className="chatList-header">
      <div className="header">
        <h2 className="title">Chats</h2>
        <div className="icons">
          <MdOutlineChat onClick={() => setAddMode(!addMode)} />

          {/* More button with dropdown */}
          <MenuContainer menuId="actionMenuInChatList">
            <Logout element="button" />
            <button>Profile</button>
            <button onClick={handleSelectChats}>
              {selectMode ? "Cancel Select" : "Select Chats"}
            </button>
          </MenuContainer>
        </div>
      </div>

      {!selectMode && (
        <>
          <div className="search-container">
            <SearchBox input={searchInput} setInput={setSearchInput} />
          </div>

          <div className="filters">
            <button className="active">All</button>
            <button>Unread</button>
            <button>Favorites</button>
            <button>Groups</button>
          </div>
        </>
      )}

      {/* Select Mode Header */}
      {selectMode && (
        <div className="select-header">
          <div className="select-info">
            <MdClose onClick={handleCancelSelect} />
            <span>{selectedChats.length} Selected</span>
          </div>
          <div className="select-actions">
            {selectedChats.length > 0 && (
              <>
                <button onClick={() => setConfirmDelete(true)}>Delete</button>
                <button onClick={handleCancelSelect}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDelete && (
        <DeleteChatsModal
          isOpen={confirmDelete}
          setIsOpen={setConfirmDelete}
          onConfirm={handleDeleteChats}
          isSingle={false}
        />
      )}
    </div>
  );
};

export default ChatListHeader;
