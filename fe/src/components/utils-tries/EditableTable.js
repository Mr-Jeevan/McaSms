import { useState } from 'react';

const EditableTable = ({ data }) => {
    const [pressTimer, setPressTimer] = useState(null);
    const [showEditForId, setShowEditForId] = useState(null);

    const handleMouseDown = (id) => {
        const timer = setTimeout(() => {
            setShowEditForId(id);
        }, 300); // Long press duration
        setPressTimer(timer);
    };

    const cancelPress = () => {
        clearTimeout(pressTimer);
    };

    return (
        <div className="table-responsive">
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Age</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((student, index) => (
                        <tr key={student.id}>
                            <td
                                onMouseDown={() => handleMouseDown(student.id)}
                                onMouseUp={cancelPress}
                                onMouseLeave={cancelPress}
                                onTouchStart={() => handleMouseDown(student.id)}
                                onTouchEnd={cancelPress}
                            >
                                {student.id}
                                {showEditForId === student.id && (
                                    <button
                                        onClick={() => alert(`Edit student ${student.name}`)}
                                        className="btn btn-sm btn-info ms-2"
                                    >
                                        Edit
                                    </button>
                                )}
                            </td>
                            <td>{student.name}</td>
                            <td>{student.age}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EditableTable;
