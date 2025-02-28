import { FaArrowLeft } from "react-icons/fa";
import PropTypes from "prop-types";
import "./SettingsHeader.css"; 

const SettingsHeader = ({ title, onBack }) => {
  return (
    <header className="common-header">
      <button className="backButton" onClick={onBack}>
        <FaArrowLeft size={20}/>
      </button>
      <h2 className="title">{title}</h2>
    </header>
  );
};

SettingsHeader.propTypes = {
  title: PropTypes.string.isRequired, 
  onBack: PropTypes.func.isRequired, 
};

export default SettingsHeader;
