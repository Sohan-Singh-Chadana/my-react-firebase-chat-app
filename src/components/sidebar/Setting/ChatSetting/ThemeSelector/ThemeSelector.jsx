import { useState, useContext } from "react";
import { ThemeContext } from "../../../../../context/ThemeContext";
import Modal from "../../../../common/modal/Modal";
import ThemeOption from "../../../../common/ThemeOption";
import useSettingStore from "../../../../../store/useSettingStore";

const ThemeSelector = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const { closeSetting} = useSettingStore();

  const handleSelectTheme = (e) => {
    e.stopPropagation();
    setTheme(selectedTheme);
    closeSetting();
  };

  const handleClose = (e) => {
    e.stopPropagation();
    closeSetting();
  };

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      onConfirm={handleSelectTheme}
      title="Select Theme"
      confirmText="OK"
      cancelText="Cancel"
    >
      <div className="theme-option">
        <ThemeOption
          label="Light"
          id="light"
          selected={selectedTheme === "light"}
          onChange={() => setSelectedTheme("light")}
        />
        <ThemeOption
          label="Dark"
          id="dark"
          selected={selectedTheme === "dark"}
          onChange={() => setSelectedTheme("dark")}
        />
        <ThemeOption
          label="System Default"
          id="system"
          selected={selectedTheme === "system"}
          onChange={() => setSelectedTheme("system")}
        />
      </div>
    </Modal>
  );
};

export default ThemeSelector;
