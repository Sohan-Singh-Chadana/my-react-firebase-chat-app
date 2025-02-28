import "./ThemeOption.css";

const ThemeOption = ({ label, id, selected, onChange }) => {
  return (
    <div className="theme-option-item">
      <input
        type="radio"
        id={id}
        name="theme"
        checked={selected}
        onChange={onChange}
      />
      <label htmlFor={id}>
        <span className="custom-radio"></span>
        {label}
      </label>
    </div>
  );
};

export default ThemeOption;
