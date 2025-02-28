import SettingsHeader from "../../../common/SettingsHeader";

const KeyboardShortcuts = ({ onBack }) => {
  return (
    <div className="keyboard-shortcuts">
      <SettingsHeader title="Keyboard Shortcuts" onBack={onBack} />
    </div>
  );
};
export default KeyboardShortcuts;
