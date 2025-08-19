import "./StudentActionModal.css";

const StudentActionModal = ({ student, onClose, onDelete }) => {
  if (!student) return null;

  // Function to handle the delete confirmation
  const handleDelete = () => {
    onDelete(student._id); // Pass the student ID back to the parent
    onClose(); // Close the modal
  };

  return (
    <>
      <section id="studentactionmodal">
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-dialog glass-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
              </div>
              <div className="modal-body text-center">
                <p>Are you sure you want to delete this student record?</p>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StudentActionModal;
