import { MdPermScanWifi } from "react-icons/md";
import "./OfflineAlert.css";

const OfflineAlert = () => {
  return (
    <div className="offlineAlert">
      <div className="offlineIcon">
        <MdPermScanWifi />
      </div>
      <div className="offlineText">
        <h4>Computer not connected</h4>
        <p>Make sure your computer has an active internet connection.</p>
      </div>
    </div>
  );
};

export default OfflineAlert;
