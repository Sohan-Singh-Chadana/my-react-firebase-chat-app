import SettingsHeader from "../../../common/SettingsHeader";

const Notifications = ({ onBack }) => {
  return (
    <div className="notifications">
       <SettingsHeader title="Notification List" onBack={onBack} />
    </div>
  );
};
export default Notifications;
