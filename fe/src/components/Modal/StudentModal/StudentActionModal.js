import "./StudentActionModal.css";

const StudentActionModal = ({ student, onClose, onEdit, onDelete }) => {
  if (!student) return null;

  return (
    <>
      <section id="studentactionmodal">
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-dialog glass-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Actions for {student?.sno} – {student?.Name || "Student"}
                </h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
              </div>
              <div className="modal-body d-flex justify-content-around">
                <button className="btn btn-primary" onClick={onEdit}>Edit</button>
                <button className="btn btn-danger" onClick={onDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StudentActionModal;
