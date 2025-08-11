import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './McaTwo.css';
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
                const flattened = data.map(s => ({ _id: s._id, ...s.data }));
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
                const student = students.find(s => s._id === studentId);
                const updatedStudent = { ...student, ...fields };
                const dataOnly = { ...updatedStudent };
                delete dataOnly._id;

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
            setEditedCell({});
        }
        setEditMode(prev => !prev);
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
      const saved = await addMcaTwoStudent({ data: newStudentData });
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
    <section id="mcatwo">
      <div className="container mt-5">
        <h1>MCA II Management System</h1>

                {/* Accordion for actions */}
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
                            "Mca_2_filtered.xlsx",
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
                            "Mca_2_all.xlsx"
                          )
                        }
                      >
                        Export All
                      </button>
                    </div>
                  </div>
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
                className="form-select border-0 glass_card text-light ms-2 "
                value={filterColumnTitle}
                onChange={(e) => setFilterColumnTitle(e.target.value)}
              >
                <option className="form-input" value="All Columns">Search All Columns</option>
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
                                                                ...prev[student._id],
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