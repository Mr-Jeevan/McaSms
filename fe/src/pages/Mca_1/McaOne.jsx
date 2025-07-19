import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; // Keep if you use it elsewhere
import '../../GolbalCss/McaOne.css'; // This path is correct based on your snippet

import { exportToExcel, exportFilteredToExcel } from '../../utils/ExportToExcel';

// Changed function name from McaTwo to McaOne
const McaOne = () => {
    // const navigate = useNavigate(); // Keep if you use it elsewhere

    const [students, setStudents] = useState([]);
    const [allColumns, setAllColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newColumn, setNewColumn] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editedCell, setEditedCell] = useState({});

    // Filtering logic remains the same
    const displayedStudents = students.filter(student =>
        allColumns.some(col =>
            String(student[col.title] ?? '').toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Fetch columns on component mount
    useEffect(() => {
        const fetchColumns = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/headers');
                const data = await res.json();
                setAllColumns(data);
                // Ensure there are at least 3 columns before slicing
                setSelectedColumns(data.slice(0, 3).map(col => col.title));
            } catch (err) {
                console.error('Failed to fetch columns:', err);
            }
        };
        fetchColumns();
    }, []);

    // Fetch students on component mount
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/students');
                const data = await res.json();
                const flattened = data.map(s => ({ _id: s._id, ...s.data }));
                setStudents(flattened);
            } catch (err) {
                console.error('Failed to load students:', err);
            }
        };
        fetchStudents();
    }, []);

    // Toggle edit mode and save changes
    const handleEditToggle = async () => {
        if (editMode) {
            const updates = Object.entries(editedCell);
            for (const [studentId, fields] of updates) {
                const student = students.find(s => s._id === studentId);
                const updatedStudent = { ...student, ...fields };
                const dataOnly = { ...updatedStudent };
                delete dataOnly._id; // Remove _id before sending to API if your backend expects it

                try {
                    const res = await fetch(`http://localhost:3001/api/students/${studentId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ data: dataOnly }),
                    });
                    const saved = await res.json();
                    setStudents(prev => prev.map(s => s._id === studentId ? { _id: saved._id, ...saved.data } : s));
                } catch (err) {
                    console.error(`Error saving student ${studentId}:`, err);
                }
            }
            setEditedCell({}); // Clear edited cells after saving
        }
        setEditMode(prev => !prev);
    };

    // Handle column checkbox changes for export
    const handleCheckboxChange = (colTitle) => {
        setSelectedColumns(prev =>
            prev.includes(colTitle)
                ? prev.filter(c => c !== colTitle)
                : [...prev, colTitle]
        );
    };

    return (
        // Changed section id from "mcatwo" to "mcaone"
        <section id="mcaone">
            <div className="container mt-5">
                <h1>MCA Management System</h1>

                {/* Accordion for actions */}
                <div className="accordion accordion-flush shadow-sm rounded bg-light" id="accordionFlushExample">

                    <div className="accordion-item rounded">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed bg-four rounded " type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne">
                                <div className='txt-bold'>ACTIONS</div>
                            </button>
                        </h2>
                        {/* Action buttons */}
                        <div id="flush-collapseOne" className="accordion-collapse collapse rounded">
                            <div className="accordion-body bg-light ">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <div className="input-group"> {/* Removed w-50 as col-md-6 manages width */}
                                            <input
                                                type="text"
                                                // Removed width="100px" as form-control handles it
                                                className="form-control bg-mid txt-gray"
                                                placeholder="Enter new column name"
                                                value={newColumn}
                                                onChange={(e) => setNewColumn(e.target.value)}
                                            />
                                            <button
                                                className="btn bg-one text-white"
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
                                                                [title]: '' // Add new column with empty string for existing students
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
                                    </div>

                                    {/* Right Column for Export Buttons */}
                                    <div className="col-md-6 mb-3">
                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                            <button className="btn bg-one text-white" onClick={() => exportFilteredToExcel(displayedStudents, 'Mca_2_filtered.xlsx', selectedColumns)}>
                                                Export Selected
                                            </button>
                                            <button className="btn bg-mid" onClick={() => exportToExcel(displayedStudents, 'Mca_2_all.xlsx')}>
                                                Export All
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table borderless-row bg-transparent mb-0"> {/* Added mb-0 to remove extra space */}
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

                {/* Search, Add Student, and Edit Buttons */}
                <div className="row my-3 align-items-center">
                    {/* Search Input Column */}
                    <div className="col-md-6 col-lg-4 mb-3 mb-md-0">
                        <input
                            type="text"
                            // Removed w-50 as column handles width
                            className="search_input form-control border-0 glass_card text-dark"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Student Add and Edit Buttons */}
                    <div className="col-md-6 col-lg-8 d-flex justify-content-end gap-2 mb-3 mb-md-0">
                        <button
                            className="btn transparent_input flex-grow-1 flex-md-grow-0"
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
                        <button
                            className="btn bg-mid flex-grow-1 flex-md-grow-0"
                            onClick={handleEditToggle}
                        >
                            {editMode ? 'Disable Edit' : 'Enable Edit'}
                        </button>
                    </div>
                </div>


                {/* Main Student Data Table */}
                <div className="overflow-auto table-responsive glass_card p-2 pt-2 rounded">
                    <div className='text-'>
                        <h3 className='clr-three text-center'>MCA I Student Details</h3> {/* Changed title to MCA I */}
                    </div>
                    {/* Added mb-0 to the table to remove extra space */}
                    <table className="table borderless-row table-light mb-0">
                        <thead className='bg-mid' style={{ color: "white" }}>
                            <tr className='bg-mid'>
                                {allColumns.map((col, idx) => (
                                    <th key={col._id} className={`${idx === 0 ? "sticky-col" : idx === 1 ? "sticky-col-2" : ""}`}>
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
                                                // Display the actual ID from the student object, not just the index
                                                idx === 0 && col.title === 'ID' ? student.ID : student[col.title] ?? ""
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

export default McaOne;