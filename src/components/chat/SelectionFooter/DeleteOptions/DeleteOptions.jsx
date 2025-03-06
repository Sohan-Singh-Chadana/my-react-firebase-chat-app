import "./DeleteOptions.css";
const DeleteOptions = ({
  isDeleteForEveryoneAllowed,
  onDeleteForEveryone,
  onDeleteForMe,
  onCancel,
}) => {
  return (
    <div className="delete-options">
      {isDeleteForEveryoneAllowed && (
        <button
          className="delete-option delete-everyone"
          onClick={onDeleteForEveryone}
        >
          Delete for Everyone
        </button>
      )}

      <button className="delete-option" onClick={onDeleteForMe}>
        Delete for Me
      </button>

      <button className="delete-option cancel" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};

export default DeleteOptions;
