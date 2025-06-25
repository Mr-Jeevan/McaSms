import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import "./index.css"

import { McaTwoColumns } from '../config/McaTwoColumns';


import { exportToExcel } from '../utils/ExportToExcel';
import { exportFilteredToExcel } from '../utils/ExportToExcel';



const McaTwo = () => {

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');

    const [pressTimer, setPressTimer] = useState(null);
    const [showEditForId, setShowEditForId] = useState(null);

    const [students, setStudents] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState(['id', 'Student-Name', 'Age']); // default selected

    const [allColumns, setAllColumns] = useState(McaTwoColumns);

    const [newColumn, setNewColumn] = useState('');


    // Filtered view (temporary search result)
    const displayedStudents = students.filter(student =>
        allColumns.some(col =>
            String(student[col] ?? '').toLowerCase().includes(searchTerm.toLowerCase())
        )
    );


    const handleMouseDown = (id) => {

        const timer = setTimeout(() => {
            setShowEditForId(id);
        }, 300);
        setPressTimer(timer);
    };
    const cancelPress = () => {
        clearTimeout(pressTimer);
    };
    const handleCheckboxChange = (col) => {
        setSelectedColumns((prev) =>
            prev.includes(col)
                ? prev.filter((c) => c !== col)
                : [...prev, col]
        );
    };



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

    return (
        <>
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
                                        onClick={() => {
                                            if (newColumn && !allColumns.includes(newColumn)) {
                                                setAllColumns([...allColumns, newColumn]);
                                                setStudents(prev =>
                                                    prev.map(student => ({
                                                        ...student,
                                                        [newColumn]: "" // default value for the new column
                                                    }))
                                                );
                                                setNewColumn('');
                                            }
                                        }}

                                    >
                                        Add Column
                                    </button>
                                </div>
                                <hr />

                                <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                                    {/* export specifics */}
                                    <button className="btn btn-primary mb-3" onClick={() => exportFilteredToExcel(students, 'Mca_2_filetered.xlsx', selectedColumns)}>
                                        Export Selected
                                    </button>
                                    {/* export all */}
                                    <button className='btn btn-warning  mb-3' onClick={() => exportToExcel(students, 'Mca_2.xlsx')}>
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
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        checked={selectedColumns.includes(col)}
                                                                        onChange={() => handleCheckboxChange(col)}
                                                                    />
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
                    {/* search */}
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
                    <table className="table table-striped table-bordered mt-3" >
                        <thead className="table-primary">
                            <tr>
                                {allColumns.map((col, idx) => (
                                    <th key={col} className={idx === 0 ? "sticky-col" : idx === 1 ? "sticky-col-2" : ""}>
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>


                        <tbody>
                            {displayedStudents.map((student, i) => (
                                <tr key={student.sno}>
                                    {allColumns.map((col, idx) => (
                                        <td
                                            key={col}
                                            className={idx === 0 ? "sticky-col" : idx === 1 ? "sticky-col-2" : ""}
                                            onMouseDown={idx === 0 ? () => handleMouseDown(student.sno) : undefined}
                                            onMouseUp={idx === 0 ? cancelPress : undefined}
                                            onMouseLeave={idx === 0 ? cancelPress : undefined}
                                            onTouchStart={idx === 0 ? () => handleMouseDown(student.sno) : undefined}
                                            onTouchEnd={idx === 0 ? cancelPress : undefined}
                                        >
                                            {idx === 0 ? i + 1 : student[col] ?? ""}
                                            {idx === 0 && showEditForId === student.sno && (
                                                <button
                                                    onClick={() => {
                                                        alert(`Edit student ${student.Name} ${student.sno || 'No ID found'}`);
                                                        navigate(`/Edit/${student.id}`)
                                                        setShowEditForId(null); // reset after click
                                                    }}
                                                    className="btn btn-sm btn-info ms-2"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div >
        </>
    );
};

export default McaTwo;
