import { MdOutlineArchive } from "react-icons/md";
import './ArchivedChats.css'

const ArchivedChats = () => {
  return (
    <div className="archived">
      <MdOutlineArchive />
      <div className="archived-text">
        <p>Archived</p>
        <p className="archived-count">0</p>
      </div>
    </div>
  );
};

export default ArchivedChats;
