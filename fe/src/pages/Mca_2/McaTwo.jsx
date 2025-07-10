import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import "./McaTwo.css"


import StudentActionModal from '../../components/Modal/StudentModal/StudentActionModal.js'
import ColumnActionModal from "../../components/Modal/ColumnModal/ColumnActionModal.js";

import { McaTwoColumns } from '../../config/McaTwoColumns.js';


import { exportToExcel } from '../../utils/ExportToExcel.js';
import { exportFilteredToExcel } from '../../utils/ExportToExcel.js';




const McaTwo = () => {

    // Navigation and logic
    const navigate = useNavigate();

    // Student data
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Table configuration
    const [allColumns, setAllColumns] = useState([]); // now array of objects: [{ _id, title }]


    // UI interaction
    const [searchTerm, setSearchTerm] = useState('');
    const [newColumn, setNewColumn] = useState('');
    const [selectedColumns, setSelectedColumns] = useState(['id', 'Student-Name', 'Age']);
    const [selectedColumn, setSelectedColumn] = useState(null);
    const [colPressTimer, setColPressTimer] = useState(null);


    // UX behavior
    const [pressTimer, setPressTimer] = useState(null);


    // Filtered view (temporary search result)
    const displayedStudents = students.filter(student =>
        allColumns.some(col =>
            String(student[col] ?? '').toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    useEffect(() => {
        const fetchColumns = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/headers');
                const data = await res.json(); // data is [{ _id, title }, ...]

                setAllColumns(data); // stores full column objects

                // ✅ Fix the undefined error here
                setSelectedColumns(data.slice(0, 3).map(col => col.title));
            } catch (err) {
                console.error('Failed to fetch columns:', err);
            }
        };

        fetchColumns();
    }, []);


    // fetch from API
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('/students.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok' + response.statusText)
                } else {

                    const data = await response.json();
                    setStudents(data);
                    console.log('Fetched students:', data[0]);
                }

            } catch (error) {
                console.error('Error fetching students:', error)
            }
        };
        fetchStudents();
    }, []);


    // delete student logic
    const handleDeleteStudent = (student) => {
        setStudents(prev => prev.filter(s => s.sno !== student.sno));
        setSelectedStudent(null); // close modal after delete
    };


    // long press edit btn logics

    const handleMouseDown = (student) => {

        const timer = setTimeout(() => {
            setSelectedStudent(student);
        }, 300);
        setPressTimer(timer);
    };
    const cancelPress = () => {
        clearTimeout(pressTimer);
    };
    const handleCheckboxChange = (colTitle) => {
        setSelectedColumns((prev) =>
            prev.includes(colTitle)
                ? prev.filter(c => c !== colTitle)
                : [...prev, colTitle]
        );
    };


    return (
        <>
            <section id='mcatwo'>

                <div className='container mt-5 '>
                    <div>
                        <h1>MCA II Management System</h1>
                    </div>

                    <div className="accordion accordion-flush shadow-sm border rounded " id="accordionFlushExample">
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button btn collapsed bg-info text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                    <div className='text-center'>ACTIONS</div>
                                </button>
                            </h2>
                            {/* accordion */}
                            <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
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
                                                if (newColumn && !allColumns.includes(newColumn)) {
                                                    try {
                                                        const res = await fetch('http://localhost:3000/api/headers', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ title: newColumn.trim() })
                                                        });

                                                        if (!res.ok) {
                                                            const err = await res.json();
                                                            console.error('Error adding column:', err.message);
                                                            return;
                                                        }

                                                        const result = await res.json();
                                                        setAllColumns(prev => [...prev, result]);
                                                        setStudents(prev =>
                                                            prev.map(student => ({
                                                                ...student,
                                                                [newColumn.trim()]: ""
                                                            }))
                                                        );
                                                        setNewColumn('');
                                                    } catch (error) {
                                                        console.error('Failed to add column:', error);
                                                    }
                                                }
                                            }}


                                        >
                                            Add Column
                                        </button>
                                    </div>
                                    <hr />

                                    <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                                        {/* export specifics */}
                                        <button className="btn btn-primary mb-3" onClick={() => exportFilteredToExcel(displayedStudents, 'Mca_2_filetered.xlsx', selectedColumns)}>
                                            Export Selected
                                        </button>
                                        {/* export all */}
                                        <button className='btn btn-warning  mb-3' onClick={() => exportToExcel(displayedStudents, 'Mca_2.xlsx')}>
                                            Export all
                                        </button>
                                    </div>
                                    {/* selection table */}
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped">
                                            <tbody>
                                                {Array.from({ length: Math.ceil(allColumns.length / 4) }, (_, rowIndex) => (
                                                    <tr key={rowIndex}>
                                                        {Array.from({ length: 4 }, (_, colIndex) => {
                                                            const index = colIndex * Math.ceil(allColumns.length / 4) + rowIndex;
                                                            const col = allColumns[index];
                                                            return col ? (
                                                                <td key={col} className="px-2">
                                                                    <label className="form-check form-check-label">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedColumns.includes(col.title)}
                                                                            onChange={() => handleCheckboxChange(col.title)}
                                                                        />
                                                                        {col.title}

                                                                        {col}
                                                                    </label>
                                                                </td>
                                                            ) : (
                                                                <td key={colIndex}></td>
                                                            );
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
                    {/* Search */}
                    <div className="my-3 d-flex justify-content-between">
                        <div>
                            <input type="text" className="form-control mt-3" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div>
                            {/* add Students */}
                            <button
                                className="btn btn-success my-3"
                                onClick={() => {
                                    const newId = students.length ? Math.max(...students.map(s => s.ID)) + 1 : 1;
                                    const newStudent = { ID: newId };

                                    allColumns.forEach(col => {
                                        if (col !== 'ID') newStudent[col] = '';
                                    });

                                    setStudents([...students, newStudent]);
                                }}
                            >
                                ➕ Add Student
                            </button>

                        </div>

                    </div>

                    {/* data table */}
                    <div className="overflow-auto table-responsive" >
                        <table className="table table-striped table-bordered mt-3 table-light" >
                            <thead className="head" style={{ backgroundColor: "#4CAF50", color: "white" }}>
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
                            {/* TABLE BODY */}
                            <tbody>
                                {displayedStudents.map((student, i) => (
                                    <tr key={student.sno}>
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
                </div >
                <StudentActionModal
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                    onEdit={() => {
                        navigate(`/Edit/${selectedStudent.id}`);
                        setSelectedStudent(null);
                    }}
                    onDelete={() => handleDeleteStudent(selectedStudent)}

                />
                <ColumnActionModal
                    column={selectedColumn}
                    onClose={() => setSelectedColumn(null)}
                    onRename={() => {
                        const newName = prompt("Enter new column name", selectedColumn);
                        if (newName && newName !== selectedColumn) {
                            setAllColumns(cols => cols.map(c => (c === selectedColumn ? newName : c)));
                            setStudents(prev =>
                                prev.map(student => {
                                    const updated = { ...student };
                                    updated[newName] = updated[selectedColumn];
                                    delete updated[selectedColumn];
                                    return updated;
                                })
                            );
                        }
                        setSelectedColumn(null);
                    }}
                    onDelete={() => {
                        setAllColumns(cols => cols.filter(c => c !== selectedColumn));
                        setSelectedColumns(cols => cols.filter(c => c !== selectedColumn));
                        setStudents(prev =>
                            prev.map(student => {
                                const updated = { ...student };
                                delete updated[selectedColumn];
                                return updated;
                            })
                        );
                        setSelectedColumn(null);
                    }}
                />

            </section>
        </>
    );
};

export default McaTwo;
