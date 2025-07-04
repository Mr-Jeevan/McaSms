import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { McaTwoColumns } from '../../config/McaTwoColumns';

const Edit = () => {
    const { id } = useParams();


    const [students, setStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [allColumns, setAllColumns] = useState(McaTwoColumns);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('/students.json');
                if (!response.ok) throw new Error('Network error: ' + response.statusText);
                const data = await response.json();
                setStudents(data);
                const studentToEdit = data.find((s) => String(s.id) === id);
                setEditingStudent(studentToEdit || null);


            } catch (error) {
                console.error('Fetch error:', error);
            }
        };
        fetchStudents();
    }, []);



    const handleSave = async () => {
        try {
            const res = await fetch(`/api/students/${editingStudent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingStudent),
            });
            if (!res.ok) throw new Error('Failed to save');
            const updatedStudent = await res.json();

            setStudents((prev) =>
                prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
            );
            setEditingStudent(null);
        } catch (err) {
            console.error('Save failed:', err);
        }
    };


    return (
        <div className="container mt-3">
            <h2>Student Editor</h2>

            {editingStudent && (
                <div className=" p-3 my-3">
                    <h5>Edit Student</h5>
                    {allColumns.map((col) => (
                        <div className="mb-2" key={col}>
                            <label>{col}</label>
                            <input
                                type="text"
                                className="form-control"
                                value={editingStudent[col] ?? ""}
                                onChange={(e) =>
                                    setEditingStudent({ ...editingStudent, [col]: e.target.value })
                                }
                            />
                        </div>
                    ))}
                    <div className="d-flex gap-2 mt-3">
                        <button className="btn btn-success" onClick={handleSave}>
                            Save
                        </button>
                        <button className="btn btn-secondary" onClick={() => setEditingStudent(null)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Edit;
