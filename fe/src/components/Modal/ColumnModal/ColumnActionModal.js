import "./BrowserRouter.css"; // ensure styles are applied

const ColumnActionModal = ({
  column,
  onClose,
  onRename,
  onDelete
}) => {
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
                <button className="btn btn-primary" onClick={onRename}>
                  ✏️ Rename
                </button>
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
