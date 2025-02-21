import { MdClose, MdSearch } from "react-icons/md";
import "./searchBox.css";

const SearchBox = ({
  input,
  setInput,
  onSubmit = (e) => e.preventDefault(),
}) => {
  return (
    <form onSubmit={onSubmit} className="search">
      <div className="searchBar">
        <button type="submit">
          <MdSearch />
        </button>
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          name="username"
        />
        {input && <MdClose onClick={() => setInput("")} />}
      </div>
    </form>
  );
};

export default SearchBox;
