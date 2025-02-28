import SettingsHeader from "../../../common/SettingsHeader";

const Account = ({ onBack }) => {
  return (
    <div className="account-setting">
      <SettingsHeader title="Account" onBack={onBack} />
    </div>
  );
};
export default Account;
