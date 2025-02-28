import SettingsHeader from "../../../common/SettingsHeader";

const Privacy = ({ onBack }) => {
  return (
    <div className="privacy-content">
      <SettingsHeader title="Privacy Settings" onBack={onBack} />
    </div>
  );
};

export default Privacy;
