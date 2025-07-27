import { useState, useEffect, useRef } from "react";
import "../../GolbalCss/McaOne.css";

import { exportToExcel, exportFilteredToExcel } from "../../utils/ExportToExcel";

import {
    getMcaOneStudents,
    addMcaOneStudent,
    updateMcaOneStudent,
    getHeaders,
    addHeader,
    updateHeader,
    deleteHeader,
} from "../../services/apiService";

import ColumnActionModal from "../../components/Modal/ColumnModal/ColumnActionModal";

const McaOne = () => {
    const [students, setStudents] = useState([]);
    const [allColumns, setAllColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]); // Still stores titles for display
    const [searchTerm, setSearchTerm] = useState("");
    const [newColumn, setNewColumn] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [editedCell, setEditedCell] = useState({}); // editedCell[student._id][col._id] = value

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedColumnForAction, setSelectedColumnForAction] = useState(null);
    const [renameInputValue, setRenameInputValue] = useState("");
    const longPressTimer = useRef(null);
    const LONG_PRESS_DURATION = 700;

    // Maps for efficient lookups: title <-> _id
    const [titleToIdMap, setTitleToIdMap] = useState(new Map());
    const [idToTitleMap, setIdToTitleMap] = useState(new Map());

    // New state for filtering by a specific column
    const [filterColumnTitle, setFilterColumnTitle] = useState("All Columns");

    /**
     * Fetch columns and students on mount
     */
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const headerData = await getHeaders();
                setAllColumns(headerData);

                const newTitleToIdMap = new Map(headerData.map(col => [col.title, col._id]));
                const newIdToTitleMap = new Map(headerData.map(col => [col._id, col.title]));
                setTitleToIdMap(newTitleToIdMap);
                setIdToTitleMap(newIdToTitleMap);

                const initialSelected = headerData.map(col => col.title).filter(title => title === "ID");
                const otherSelected = headerData.slice(0, 3).map((col) => col.title).filter(title => title !== "ID");
                setSelectedColumns([...new Set([...initialSelected, ...otherSelected])]);

                const studentData = await getMcaOneStudents();
                setStudents(studentData.map(s => {
                    // Ensure ID column has the correct value
                    const idColumn = headerData.find(c => c.title === "ID");
                    const dataWithId = {
                        ...(s.data || {}),
                        [idColumn?._id]: s._id
                    };
                    return {
                        _id: s._id,
                        data: dataWithId
                    };
                }));
            } catch (err) {
                console.error("Failed to load initial data:", err);
            }
        };
        fetchInitialData();
    }, []); // Run once on mount

    /**
     * Helpers
     */
    const displayedStudents = students.filter((student) => {
        if (!searchTerm) return true; // If no search term, display all students

        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        if (filterColumnTitle === "All Columns") {
            // Search across all columns using their _id for student data access
            return allColumns.some((col) =>
                String(student.data[col._id] ?? "").toLowerCase().includes(lowerCaseSearchTerm)
            );
        } else {
            // Filter by a specific column chosen by the user
            // Need to get the _id of the selected column title
            const columnIdToFilter = titleToIdMap.get(filterColumnTitle);
            if (columnIdToFilter) {
                return String(student.data[columnIdToFilter] ?? "").toLowerCase().includes(lowerCaseSearchTerm);
            }
            return false;
        }
    });

    /**
     * Toggle edit mode – if leaving edit mode, persist edited cells
     */
    const handleEditToggle = async () => {
        if (editMode) {
            const updates = Object.entries(editedCell); // updates is [studentId, {colId: value, ...}]
            for (const [studentId, fields] of updates) {
                const studentToUpdate = students.find((s) => s._id === studentId);
                if (!studentToUpdate) continue;

                // Merge the edited fields (which are keyed by col._id) into the student's existing data map
                const updatedDataMap = {
                    ...(studentToUpdate.data || {}), // Ensure existing data is handled
                    ...fields, // fields are already keyed by column _id
                };

                try {
                    // Send the data map keyed by _id to the backend
                    const saved = await updateMcaOneStudent(studentId, { data: updatedDataMap });
                    setStudents((prev) =>
                        prev.map((s) =>
                            s._id === studentId ? { _id: saved._id, data: saved.data } : s
                        )
                    );
                } catch (err) {
                    console.error(`Error saving student ${studentId}:`, err);
                    alert(`Error saving student ${studentId}: ${err.message}`);
                }
            }
            setEditedCell({}); // Clear edited cells after saving
        }
        setEditMode((prev) => !prev);
    };

    /**
     * Column checkbox toggle
     */
    const handleCheckboxChange = (colTitle) => {
        setSelectedColumns((prev) =>
            prev.includes(colTitle) ? prev.filter((c) => c !== colTitle) : [...prev, colTitle]
        );
    };

    /**
     * Add new header/column
     */
    const handleAddColumn = async () => {
        const title = newColumn.trim();
        if (!title || allColumns.some((c) => c.title.toLowerCase() === title.toLowerCase())) {
            alert("Column name cannot be empty or a duplicate.");
            return;
        }

        try {
            const result = await addHeader(title); // result contains _id and title
            setAllColumns((prev) => [...prev, result]);

            // Update maps with new column
            setTitleToIdMap(prev => new Map(prev).set(result.title, result._id));
            setIdToTitleMap(prev => new Map(prev).set(result._id, result.title));

            // Initialize new column for existing students, using the new column's _id as the key
            setStudents((prev) =>
                prev.map((student) => ({
                    ...student,
                    data: {
                        ...(student.data || {}),
                        [result._id]: "", // Use column _id as the key for student data
                    },
                }))
            );
            setNewColumn("");
            setSelectedColumns((prev) => [...prev, result.title]); // Auto-select new column by title
        } catch (err) {
            console.error("Failed to add column:", err);
            alert("Failed to add column.");
        }
    };

    /**
     * Add blank student row
     */
    const handleAddStudent = async () => {
        const newStudentData = {};

        // Initialize all columns
        allColumns.forEach((col) => {
            newStudentData[col._id] = col.title === "ID" ? "" : ""; // Empty string for all fields
        });

        try {
            const saved = await addMcaOneStudent({ data: newStudentData });
            setStudents((prev) => [...prev, {
                _id: saved._id,
                data: {
                    ...saved.data,
                    // Ensure ID column has the correct value
                    [allColumns.find(c => c.title === "ID")?._id]: saved._id
                }
            }]);
        } catch (err) {
            console.error("Failed to add student:", err);
            alert("Failed to add student.");
        }
    };

    /**
     * Column Action Modal Handlers
     */
    const handleOpenModal = (column) => {
        setSelectedColumnForAction(column);
        setRenameInputValue(column.title); // Initialize rename input with current title
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedColumnForAction(null);
        setRenameInputValue("");
    };

    const handleRenameColumn = async () => {
        if (!selectedColumnForAction || !renameInputValue.trim()) {
            alert("New column name cannot be empty.");
            return;
        }
        const oldTitle = selectedColumnForAction.title;
        const newTitle = renameInputValue.trim();
        const columnId = selectedColumnForAction._id;

        if (oldTitle === newTitle) {
            handleCloseModal(); // No change, just close
            return;
        }

        if (allColumns.some(col => col.title.toLowerCase() === newTitle.toLowerCase() && col._id !== columnId)) {
            alert("A column with this name already exists.");
            return;
        }

        try {
            await updateHeader(columnId, newTitle); // Update the header document's title in the backend

            // Update allColumns state: change title of the specific column
            setAllColumns(prev => prev.map(col =>
                col._id === columnId ? { ...col, title: newTitle } : col
            ));

            // Update the title <-> id lookup maps
            setTitleToIdMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(oldTitle);
                newMap.set(newTitle, columnId);
                return newMap;
            });
            setIdToTitleMap(prev => new Map(prev).set(columnId, newTitle));

            // IMPORTANT: Since student data is now keyed by col._id,
            // there is NO NEED to iterate through students and rename keys in their data.
            // The student data itself is not affected by a column title change.

            // Update selectedColumns state (which stores titles for display)
            setSelectedColumns(prev => prev.map(title =>
                title === oldTitle ? newTitle : title
            ));

            alert(`Column "${oldTitle}" renamed to "${newTitle}" successfully!`);
            handleCloseModal();
        } catch (error) {
            console.error("Error renaming column:", error);
            alert(`Failed to rename column: ${error.message}`);
        }
    };

    const handleDeleteColumn = async () => {
        if (!selectedColumnForAction) return;

        if (selectedColumnForAction.title === "ID") {
            alert("The 'ID' column cannot be deleted.");
            return;
        }

        if (!window.confirm(`Are you sure you want to delete the column "${selectedColumnForAction.title}" and all its data?`)) {
            return;
        }

        const columnToDeleteId = selectedColumnForAction._id;
        const columnToDeleteTitle = selectedColumnForAction.title;

        try {
            await deleteHeader(columnToDeleteId);

            // Remove column from allColumns
            setAllColumns(prev => prev.filter(col => col._id !== columnToDeleteId));

            // Remove the column from the title <-> id lookup maps
            setTitleToIdMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(columnToDeleteTitle);
                return newMap;
            });
            setIdToTitleMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(columnToDeleteId);
                return newMap;
            });

            // Remove data for this column (using its _id) from all students' data maps
            setStudents(prev => prev.map(student => {
                const newStudentData = { ...(student.data || {}) };
                delete newStudentData[columnToDeleteId]; // Delete using the column's _id
                return { ...student, data: newStudentData };
            }));

            // Remove column from selectedColumns if it was selected (still uses title)
            setSelectedColumns(prev => prev.filter(title => title !== columnToDeleteTitle));

            alert(`Column "${columnToDeleteTitle}" deleted successfully.`);
            handleCloseModal();
        } catch (error) {
            console.error("Error deleting column:", error);
            alert(`Failed to delete column: ${error.message}`);
        }
    };

    /**
     * Long Press Event Handlers for Table Headers
     */
    const handlePressStart = (column) => {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = setTimeout(() => {
            if (column.title !== "ID") {
                handleOpenModal(column);
            } else {
                alert("The 'ID' column cannot be renamed or deleted.");
            }
        }, LONG_PRESS_DURATION);
    };

    const handlePressEnd = () => {
        clearTimeout(longPressTimer.current);
    };

    const handleMouseLeave = () => {
        clearTimeout(longPressTimer.current);
    };

    useEffect(() => {
        return () => {
            clearTimeout(longPressTimer.current);
        };
    }, []);

    return (
        <section id="mcaone">
            <div className="container mt-5">
                <h1>MCA I Management System</h1>

                {/* Accordion for actions */}
                <div
                    className="accordion accordion-flush shadow-sm rounded bg-light"
                    id="accordionFlushExample"
                >
                    <div className="accordion-item rounded">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed bg-four rounded "
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#flush-collapseTwo"
                            >
                                <div className="txt-bold">ACTIONS</div>
                            </button>
                        </h2>
                        {/* action btns */}
                        <div id="flush-collapseTwo" className="accordion-collapse collapse rounded">
                            <div className="accordion-body bg-light ">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <div className="input-group w-50">
                                            <input
                                                type="text"
                                                width="100px"
                                                className="form-control bg-mid txt-gray"
                                                placeholder="Enter new column name"
                                                value={newColumn}
                                                onChange={(e) => setNewColumn(e.target.value)}
                                            />
                                            <button className="btn bg-one text-white" onClick={handleAddColumn}>
                                                Add Column
                                            </button>
                                        </div>
                                    </div>

                                    {/* Right Column for Export Buttons */}
                                    <div className="col-md-6 mb-3">
                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                            <button
                                                className="btn bg-one text-white"
                                                onClick={() =>
                                                    exportFilteredToExcel(
                                                        // Re-map internal ID-keyed data to title-keyed objects for export
                                                        displayedStudents.map(student => {
                                                            const exportedStudent = { _id: student._id };
                                                            for (const col of allColumns) {
                                                                if (selectedColumns.includes(col.title)) {
                                                                    exportedStudent[col.title] = student.data[col._id] || "";
                                                                }
                                                            }
                                                            return exportedStudent;
                                                        }),
                                                        "Mca_1_filtered.xlsx",
                                                        selectedColumns
                                                    )
                                                }
                                            >
                                                Export Selected
                                            </button>
                                            <button
                                                className="btn bg-mid "
                                                onClick={() =>
                                                    exportToExcel(
                                                        // Same re-mapping needed for exportAll
                                                        displayedStudents.map(student => {
                                                            const exportedStudent = { _id: student._id };
                                                            for (const col of allColumns) {
                                                                exportedStudent[col.title] = student.data[col._id] || "";
                                                            }
                                                            return exportedStudent;
                                                            // For simplicity, assuming export functions can handle 'data' map or need adaptation
                                                        }),
                                                        "Mca_1_all.xlsx"
                                                    )
                                                }
                                            >
                                                Export All
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Column selection table */}
                                <div className="table-responsive">
                                    <table className="table borderless-row bg-transparent">
                                        <tbody>
                                            {Array.from({ length: Math.ceil(allColumns.length / 4) }, (_, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    {Array.from({ length: 4 }, (_, colIndex) => {
                                                        const index = colIndex * Math.ceil(allColumns.length / 4) + rowIndex;
                                                        const col = allColumns[index];
                                                        return col ? (
                                                            <td
                                                                key={col._id}
                                                                className="align-middle"
                                                                onClick={() => handleCheckboxChange(col.title)}
                                                                style={{ cursor: "pointer" }}
                                                            >
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

                {/* Search and add and edit */}
                <div className="row my-3 align-items-center">
                    {/* Search Input Column */}
                    <div className="col-md-6 col-lg-4 mb-3 mb-md-0">
                        <div className="input-group"> {/* Add this div for input-group*/}
                            <input
                                type="text"
                                className="search_input form-control border-0 glass_card text-dark"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {/* New dropdown for filtering by column*/}
                            <select
                                className="form-select border-0 glass_card text-dark ms-2"
                                value={filterColumnTitle}
                                onChange={(e) => setFilterColumnTitle(e.target.value)}
                            >
                                <option value="All Columns">Search All Columns</option>
                                {allColumns.map(col => (
                                    <option key={col._id} value={col.title}>{col.title}</option>
                                ))}
                            </select>
                        </div> {/* Close the input-group div*/}
                    </div>

                    {/* student add & edit btns */}
                    <div className="col-md-6 col-lg-8 d-flex justify-content-end gap-2 mb-3 mb-md-0">
                        <button
                            className="btn transparent_input flex-grow-1 flex-md-grow-0"
                            onClick={handleAddStudent}
                        >
                            ➕ Add Student
                        </button>
                        <button
                            className="btn bg-mid flex-grow-1 flex-md-grow-0"
                            onClick={handleEditToggle}
                        >
                            {editMode ? "Disable Edit" : "Enable Edit"}
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-auto table-responsive glass_card p-2 pt-2 rounded">
                    <div className="text-">
                        <h3 className="clr-three text-center">MCA I Student Details</h3>
                    </div>
                    <div className=" overflow-hidden">
                        <table className="table borderless-row table-light mb-0 ">
                            <thead className="bg-mid" style={{ color: "white" }}>
                                <tr className="bg-mid">
                                    {allColumns.map((col, idx) => (
                                        <th
                                            key={col._id}
                                            className={
                                                idx === 0 ? "sticky-col" : idx === 1 ? "sticky-col-2" : ""
                                            }
                                            // Long press event handlers
                                            onMouseDown={() => handlePressStart(col)}
                                            onMouseUp={handlePressEnd}
                                            onMouseLeave={handleMouseLeave}
                                            onTouchStart={() => handlePressStart(col)}
                                            onTouchEnd={handlePressEnd}
                                            style={{ cursor: col.title === "ID" ? "default" : "pointer" }}
                                        >
                                            {col.title}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {displayedStudents.map((student, i) => (
                                    <tr key={student._id || i}>
                                        {/* In your table body rendering */}
                                        {allColumns.map((col, idx) => (
                                            <td
                                                key={col._id}
                                                className={idx === 0 ? "sticky-col" : idx === 1 ? "sticky-col-2" : ""}
                                            >
                                                {editMode && col.title !== "ID" ? (
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        value={
                                                            editedCell[student._id]?.[col._id] ??
                                                            student.data[col._id] ??
                                                            ""
                                                        }
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setEditedCell((prev) => ({
                                                                ...prev,
                                                                [student._id]: {
                                                                    ...prev[student._id],
                                                                    [col._id]: value,
                                                                },
                                                            }));
                                                        }}
                                                    />
                                                ) : col.title === "ID" ? (
                                                    // Display the student's _id (root level) for ID column
                                                    student._id
                                                ) : (
                                                    // Display regular data for other columns
                                                    student.data[col._id] ?? ""
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Column Action Modal */}
            {isModalOpen && selectedColumnForAction && (
                <ColumnActionModal
                    column={selectedColumnForAction}
                    onClose={handleCloseModal}
                    onRename={handleRenameColumn}
                    onDelete={handleDeleteColumn}
                    renameInputValue={renameInputValue}
                    onRenameInputChange={setRenameInputValue}
                />
            )}
        </section>
    );
};

export default McaOne;