import { useMessageSelectionStore } from "../../../../../store";
import "./SelectableCheckbox.css";

const SelectableCheckbox = ({messageId}) => {
    const { showCheckboxes, selectMessage, selectedMessages } =
    useMessageSelectionStore();
    
  return (
    <div className={`checkbox ${showCheckboxes ? "show" : ""}`}>
      <input
        type="checkbox"
        id={`checkbox-${messageId}`}
        checked={selectedMessages.includes(messageId)}
        onChange={() => selectMessage(messageId)}
      />
      <label htmlFor={`checkbox-${messageId}`}></label>
    </div>
  );
};

export default SelectableCheckbox;
