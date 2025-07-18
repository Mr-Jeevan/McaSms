import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../GolbalCss/McaTwo.css';


import { exportToExcel, exportFilteredToExcel } from '../../utils/ExportToExcel';

const McaTwo = () => {
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [allColumns, setAllColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newColumn, setNewColumn] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editedCell, setEditedCell] = useState({});

    const displayedStudents = students.filter(student =>
        allColumns.some(col =>
            String(student[col.title] ?? '').toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    useEffect(() => {
        const fetchColumns = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/headers');
                const data = await res.json();
                setAllColumns(data);
                setSelectedColumns(data.slice(0, 3).map(col => col.title));
            } catch (err) {
                console.error('Failed to fetch columns:', err);
            }
        };
        fetchColumns();
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/students');
                const data = await res.json();
                const flattened = data.map(s => ({ _id: s.id, ...s.data })); // Use s.id from backend
                setStudents(flattened);
            } catch (err) {
                console.error('Failed to load students:', err);
            }
        };
        fetchStudents();
    }, []);

    const handleEditToggle = async () => {
        if (editMode) {
            const updates = Object.entries(editedCell);
            for (const [studentId, fields] of updates) {
                try {
                    // Find the current student's full flattened data from state
                    const currentStudentInState = students.find(s => s._id === studentId);
                    if (!currentStudentInState) {
                        console.error(`Student with ID ${studentId} not found in state.`);
                        continue; // Skip to next update if student not found
                    }

                    // Prepare the data to send to the backend.
                    // The backend expects a 'data' field containing the student's attributes.
                    const dataToSendToBackend = {
                        ...currentStudentInState, // Start with all existing flattened fields
                        ...fields // Overlay with only the edited fields
                    };
                    delete dataToSendToBackend._id; // Remove the frontend's internal _id for the backend payload

                    const res = await fetch(`http://localhost:3001/api/students/${studentId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ data: dataToSendToBackend }), // Send the merged, flattened data
                    });

                    const savedResult = await res.json(); // This will be { id: "...", data: { ...flattenedData }, createdAt: "...", updatedAt: "..." }

                    // Update the frontend state with the correctly flattened data from the saved result
                    setStudents(prev =>
                        prev.map(s =>
                            s._id === studentId
                                ? { _id: savedResult.id, ...savedResult.data } // Correctly flatten saved data
                                : s
                        )
                    );
                } catch (err) {
                    console.error(`Error saving student ${studentId}:`, err);
                }
            }
            setEditedCell({});
        }
        setEditMode(prev => !prev);
    };


    const handleCheckboxChange = (colTitle) => {
        setSelectedColumns(prev =>
            prev.includes(colTitle)
                ? prev.filter(c => c !== colTitle)
                : [...prev, colTitle]
        );
    };

    return (
        <section id="mcatwo">
            <div className="container mt-5">
                <h1>MCA II Management System</h1>

                {/* Accordion for actions */}
                <div className="accordion accordion-flush shadow-sm border rounded bg-light" id="accordionFlushExample">
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed bg-four rounded text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne">
                                <div className='txt-bold'>ACTIONS</div>
                            </button>
                        </h2>

                        <div id="flush-collapseOne" className="accordion-collapse collapse ">
                            <div className="accordion-body bg-light ">
                                <div className="d-flex mb-3">
                                    <input
                                        type="text"
                                        className="form-control me-2 bg-two"
                                        placeholder="Enter new column name"
                                        value={newColumn}
                                        onChange={(e) => setNewColumn(e.target.value)}
                                    />
                                    <button
                                        className="btn bg-one"
                                        onClick={async () => {
                                            const title = newColumn.trim();
                                            if (title && !allColumns.some(c => c.title.toLowerCase() === title.toLowerCase())) {
                                                try {
                                                    const res = await fetch('http://localhost:3001/api/headers', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ title })
                                                    });
                                                    const result = await res.json();
                                                    setAllColumns(prev => [...prev, result]);
                                                    setStudents(prev => prev.map(student => ({
                                                        ...student,
                                                        [title]: ''
                                                    })));
                                                    setNewColumn('');
                                                } catch (err) {
                                                    console.error('Failed to add column:', err);
                                                }
                                            }
                                        }}
                                    >
                                        Add Column
                                    </button>
                                </div>

                                <hr />

                                <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                                    <button className="btn btn-primary mb-3" onClick={() => exportFilteredToExcel(displayedStudents, 'Mca_2_filtered.xlsx', selectedColumns)}>
                                        Export Selected
                                    </button>
                                    <button className="btn btn-warning mb-3" onClick={() => exportToExcel(displayedStudents, 'Mca_2_all.xlsx')}>
                                        Export All
                                    </button>
                                </div>

                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped">
                                        <tbody>
                                            {Array.from({ length: Math.ceil(allColumns.length / 4) }, (_, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    {Array.from({ length: 4 }, (_, colIndex) => {
                                                        const index = colIndex * Math.ceil(allColumns.length / 4) + rowIndex;
                                                        const col = allColumns[index];
                                                        return col ? (
                                                            <td key={col._id} className="align-middle" onClick={() => handleCheckboxChange(col.title)} style={{ cursor: 'pointer' }}>
                                                                <div className="form-check d-flex align-items-center gap-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        id={`check-${col._id}`}
                                                                        checked={selectedColumns.includes(col.title)}
                                                                        onChange={() => handleCheckboxChange(col.title)}
                                                                    />
                                                                    <label className="form-check-label" htmlFor={`check-${col._id}`}>
                                                                        {col.title}
                                                                    </label>
                                                                </div>
                                                            </td>
                                                        ) : <td key={colIndex}></td>;

                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Add */}
                <div className="my-3 d-flex justify-content-between">
                    <input type="text" className="form-control w-50" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <button
                        className="btn btn-success"
                        onClick={async () => {
                            const newId = students.length ? Math.max(...students.map(s => s.ID || 0)) + 1 : 1;
                            const newStudent = { ID: newId };
                            allColumns.forEach(col => {
                                if (col.title !== 'ID') newStudent[col.title] = '';
                            });
                            const res = await fetch('http://localhost:3001/api/students', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ data: newStudent })
                            });
                            const saved = await res.json();
                            setStudents(prev => [...prev, { _id: saved._id, ...saved.data }]);
                        }}
                    >
                        ➕ Add Student
                    </button>
                </div>

                <button className="btn btn-secondary mb-3" onClick={handleEditToggle}>
                    {editMode ? 'Disable Edit' : 'Enable Edit'}
                </button>

                {/* Table */}
                <div className="overflow-auto table-responsive">
                    <table className="table table-striped table-bordered mt-3 table-light">
                        <thead style={{ color: "white" }}>
                            <tr>
                                {allColumns.map((col, idx) => (
                                    <th key={col._id} className={idx === 0 ? "sticky-col" : idx === 1 ? "sticky-col-2" : ""}>
                                        {col.title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {displayedStudents.map((student, i) => (
                                <tr key={student._id || i}>
                                    {allColumns.map((col, idx) => (
                                        <td key={col._id} className={idx === 0 ? "sticky-col" : idx === 1 ? "sticky-col-2" : ""}>
                                            {editMode && col.title !== 'ID' ? (
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={editedCell[student._id]?.[col.title] ?? student[col.title] ?? ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setEditedCell(prev => ({
                                                            ...prev,
                                                            [student._id]: {
                                                                ...(prev[student._id] || {}),
                                                                [col.title]: value,
                                                            },
                                                        }));
                                                    }}

                                                />
                                            ) : (
                                                idx === 0 ? i + 1 : student[col.title] ?? ""
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default McaTwo;
