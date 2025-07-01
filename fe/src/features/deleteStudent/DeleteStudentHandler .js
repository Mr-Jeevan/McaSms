const DeleteStudentHandler = ({ student, setStudents, onClose }) => {
  if (!student) return null;

  const handleDelete = () => {
    setStudents(prev => prev.filter(s => s.sno !== student.sno));
    onClose();
  };

  return (
    <button className="btn btn-danger" onClick={handleDelete}>
      Confirm Delete
    </button>
  );
};

export default DeleteStudentHandler;
