import { useState, useEffect } from "react"; // Import useState and useEffect
import "./ColumnActionModal.css"; // ensure styles are applied, or create a specific CSS for this modal

const ColumnActionModal = ({
  column,
  onClose,
  onRename, // This will now be called when the rename button is clicked
  onDelete,
  // New props for rename functionality
  renameInputValue,
  onRenameInputChange, // Function to update renameInputValue in parent
}) => {
  // Use a local state for the input if you want to manage it entirely within the modal,
  // but for simplicity and control from parent, passing props is fine.
  // const [localRenameValue, setLocalRenameValue] = useState(column?.title || "");

  // useEffect(() => {
  //   setLocalRenameValue(column?.title || ""); // Reset local state when column changes
  // }, [column]);

  if (!column) return null;

  return (
    <>
      <section id="columnactionmodal">
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-dialog glass-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Column: {column.title}</h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
              </div>
              <div className="modal-body d-flex flex-column gap-3">
                {/* Rename Input */}
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="New column name"
                    value={renameInputValue} // Controlled by parent state
                    onChange={(e) => onRenameInputChange(e.target.value)} // Updates parent state
                  />
                  <button className="btn btn-primary" onClick={onRename}>
                    ✏️ Rename
                  </button>
                </div>
                {/* Delete Button */}
                <button className="btn btn-danger" onClick={onDelete}>
                  🗑️ Delete Column
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ColumnActionModal;