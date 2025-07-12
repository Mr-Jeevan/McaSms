import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import "./McaTwo.css";

import StudentActionModal from '../../components/Modal/StudentModal/StudentActionModal';
import ColumnActionModal from "../../components/Modal/ColumnModal/ColumnActionModal";

import { exportToExcel, exportFilteredToExcel } from '../../utils/ExportToExcel';

const McaTwo = () => {
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [allColumns, setAllColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [selectedColumn, setSelectedColumn] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [newColumn, setNewColumn] = useState('');
    const [pressTimer, setPressTimer] = useState(null);
    const [colPressTimer, setColPressTimer] = useState(null);

    // Filtered list based on search
    const displayedStudents = students.filter(student =>
        allColumns.some(col =>
            String(student[col.title] ?? '').toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Load column headers from API
    useEffect(() => {
        const fetchColumns = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/headers');
                const data = await res.json();
                setAllColumns(data);
                setSelectedColumns(data.slice(0, 3).map(col => col.title)); // titles only
            } catch (err) {
                console.error('Failed to fetch columns:', err);
            }
        };
        fetchColumns();
    }, []);

    // Load students
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/students');
                const data = await res.json();
                setStudents(data);
            } catch (err) {
                console.error('Failed to load students:', err);
            }
        };
        fetchStudents();
    }, []);

    const handleDeleteStudent = async (student) => {
        try {
            await fetch(`http://localhost:3001/api/students/${student._id}`, {
                method: 'DELETE'
            });
            setStudents(prev => prev.filter(s => s._id !== student._id));
        } catch (err) {
            console.error('Failed to delete student:', err);
        }
        setSelectedStudent(null);
    };


    const handleMouseDown = (student) => {
        const timer = setTimeout(() => setSelectedStudent(student), 300);
        setPressTimer(timer);
    };
    const cancelPress = () => clearTimeout(pressTimer);

    const handleCheckboxChange = (colTitle) => {
        setSelectedColumns(prev =>
            prev.includes(colTitle)
                ? prev.filter(c => c !== colTitle)
                : [...prev, colTitle]
        );
    };

    return (
        <section id='mcatwo'>
            <div className='container mt-5'>
                <h1>MCA II Management System</h1>

                {/* Accordion Section */}
                <div className="accordion accordion-flush shadow-sm border rounded" id="accordionFlushExample">
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button btn collapsed bg-info text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne">
                                <div className='text-center'>ACTIONS</div>
                            </button>
                        </h2>

                        <div id="flush-collapseOne" className="accordion-collapse collapse">
                            <div className="accordion-body">
                                <div className="d-flex mb-3">
                                    <input
                                        type="text"
                                        className="form-control me-2"
                                        placeholder="Enter new column name"
                                        value={newColumn}
                                        onChange={(e) => setNewColumn(e.target.value)}
                                    />
                                    <button
                                        className="btn btn-success"
                                        onClick={async () => {
                                            if (
                                                newColumn &&
                                                !allColumns.some(c => c.title.toLowerCase() === newColumn.trim().toLowerCase())
                                            ) {
                                                try {
                                                    const res = await fetch('http://localhost:3001/api/headers', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ title: newColumn.trim() })
                                                    });
                                                    const result = await res.json();
                                                    setAllColumns(prev => [...prev, result]);
                                                    setStudents(prev =>
                                                        prev.map(student => ({
                                                            ...student,
                                                            [newColumn.trim()]: ""
                                                        }))
                                                    );
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
                                    <button className='btn btn-warning mb-3' onClick={() => exportToExcel(displayedStudents, 'Mca_2_all.xlsx')}>
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
                                                            <td key={col._id}>
                                                                <label className="form-check-label">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        checked={selectedColumns.includes(col.title)}
                                                                        onChange={() => handleCheckboxChange(col.title)}
                                                                    />
                                                                    {col.title}
                                                                </label>
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

                {/* Search & Add */}
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

                            try {
                                const res = await fetch('http://localhost:3001/api/students', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(newStudent),
                                });
                                const savedStudent = await res.json();
                                setStudents(prev => [...prev, savedStudent]);
                            } catch (err) {
                                console.error('Error adding student:', err);
                            }
                        }}

                    >
                        ➕ Add Student
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-auto table-responsive">
                    <table className="table table-striped table-bordered mt-3 table-light">
                        <thead style={{ color: "white" }}>
                            <tr>
                                {allColumns.map((col, idx) => (
                                    <th
                                        key={col._id}
                                        className={idx === 0 ? "sticky-col" : idx === 1 ? "sticky-col-2" : ""}
                                        onMouseDown={() => {
                                            const timer = setTimeout(() => setSelectedColumn(col), 500);
                                            setColPressTimer(timer);
                                        }}
                                        onMouseUp={() => clearTimeout(colPressTimer)}
                                        onMouseLeave={() => clearTimeout(colPressTimer)}
                                        onTouchStart={() => {
                                            const timer = setTimeout(() => setSelectedColumn(col), 500);
                                            setColPressTimer(timer);
                                        }}
                                        onTouchEnd={() => clearTimeout(colPressTimer)}
                                    >
                                        {col.title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {displayedStudents.map((student, i) => (
                                <tr key={student.sno || i}>
                                    {allColumns.map((col, idx) => (
                                        <td
                                            key={col._id}
                                            className={idx === 0 ? "sticky-col" : idx === 1 ? "sticky-col-2" : ""}
                                            onMouseDown={idx === 0 ? () => handleMouseDown(student) : undefined}
                                            onMouseUp={idx === 0 ? cancelPress : undefined}
                                            onMouseLeave={idx === 0 ? cancelPress : undefined}
                                            onTouchStart={idx === 0 ? () => handleMouseDown(student) : undefined}
                                            onTouchEnd={idx === 0 ? cancelPress : undefined}
                                        >
                                            {idx === 0 ? i + 1 : student[col.title] ?? ""}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Student Modal */}
            <StudentActionModal
                student={selectedStudent}
                onClose={() => setSelectedStudent(null)}
                onEdit={() => {
                    navigate(`/Edit/${selectedStudent.id}`);
                    setSelectedStudent(null);
                }}
                onDelete={() => handleDeleteStudent(selectedStudent)}
            />

            {/* Column Modal */}
            <ColumnActionModal
                column={selectedColumn}
                onClose={() => setSelectedColumn(null)}
                onRename={async () => {
                    const newName = prompt("Enter new column name", selectedColumn.title);
                    if (newName && newName !== selectedColumn.title) {
                        try {
                            const res = await fetch(`http://localhost:3001/api/headers/${selectedColumn._id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ title: newName })
                            });
                            const updated = await res.json();
                            setAllColumns(cols => cols.map(c => c._id === updated._id ? updated : c));
                            setStudents(prev => prev.map(student => {
                                const copy = { ...student };
                                copy[updated.title] = copy[selectedColumn.title];
                                delete copy[selectedColumn.title];
                                return copy;
                            }));
                        } catch (err) {
                            console.error('Rename error', err);
                        }
                    }
                    setSelectedColumn(null);
                }}
                onDelete={async () => {
                    try {
                        await fetch(`http://localhost:3001/api/headers/${selectedColumn._id}`, { method: 'DELETE' });
                        setAllColumns(cols => cols.filter(c => c._id !== selectedColumn._id));
                        setSelectedColumns(cols => cols.filter(title => title !== selectedColumn.title));
                        setStudents(prev => prev.map(s => {
                            const copy = { ...s };
                            delete copy[selectedColumn.title];
                            return copy;
                        }));
                    } catch (err) {
                        console.error('Delete error', err);
                    }
                    setSelectedColumn(null);
                }}
            />
        </section>
    );
};

export default McaTwo;
