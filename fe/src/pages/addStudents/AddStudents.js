import React, { useState } from 'react';
import { McaTwoColumns } from '../../config/McaTwoColumns';

const AddStudents = ({ onSubmit }) => {
    const [student, setStudent] = useState(
        Object.fromEntries(McaTwoColumns.map(col => [col, '']))
    );


    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(student);
        setStudent(Object.fromEntries(McaTwoColumns.map(col => [col, ''])));
    };

    return (
        <div className="container my-4">
            <h4>Add Student</h4>
            <form onSubmit={handleSubmit}>
                {McaTwoColumns.map((col) => (
                    <div className="mb-2" key={col}>
                        <label className="form-label">{col}</label>
                        <input
                            type="text"
                            className="form-control"
                            name={col}
                            value={student[col]}
                            onChange={handleChange}
                        />
                    </div>
                ))}
                <button type="submit" className="btn btn-primary mt-3">Add Student</button>
            </form>
        </div>
    );
};

export default AddStudents;
