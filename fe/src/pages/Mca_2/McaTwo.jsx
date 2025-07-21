import { useState, useEffect, useRef } from "react"; // Import useRef
// import { useNavigate } from 'react-router-dom';
import "../../GolbalCss/McaTwo.css";

import { exportToExcel, exportFilteredToExcel } from "../../utils/ExportToExcel";

import {
  getMcaTwoStudents,
  addMcaTwoStudent,
  updateMcaTwoStudent,
  getHeaders,
  addHeader,
  updateHeader, // Make sure this is imported
  deleteHeader, // Make sure this is imported
} from "../../services/apiService";

import ColumnActionModal from "../../components/Modal/ColumnModal/ColumnActionModal"; // Import the new modal component

const McaTwo = () => {
  // const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [allColumns, setAllColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newColumn, setNewColumn] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedCell, setEditedCell] = useState({});

  // States for ColumnActionModal and long press
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumnForAction, setSelectedColumnForAction] = useState(null);
  const [renameInputValue, setRenameInputValue] = useState(""); // State for rename input in modal
  const longPressTimer = useRef(null); // Ref to hold the long press timeout

  // Long press duration (in milliseconds)
  const LONG_PRESS_DURATION = 700; // Adjust as needed

  /**
   * Helpers
   */
  const displayedStudents = students.filter((student) =>
    allColumns.some((col) =>
      String(student[col.title] ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  /**
   * Fetch columns on mount
   */
  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const data = await getHeaders();
        setAllColumns(data);
        // Ensure "ID" is always selected and at the beginning if it exists
        const initialSelected = data.map(col => col.title).filter(title => title === "ID");
        const otherSelected = data.slice(0, 3).map((col) => col.title).filter(title => title !== "ID");
        setSelectedColumns([...new Set([...initialSelected, ...otherSelected])]); // Use Set to avoid duplicates
      } catch (err) {
        console.error("Failed to fetch columns:", err);
      }
    };
    fetchColumns();
  }, []);

  /**
   * Fetch students on mount
   */
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getMcaTwoStudents();
        const flattened = data.map((s) => ({ _id: s._id, ...s.data }));
        setStudents(flattened);
      } catch (err) {
        console.error("Failed to load students:", err);
      }
    };
    fetchStudents();
  }, []);

  /**
   * Toggle edit mode – if leaving edit mode, persist edited cells
   */
  const handleEditToggle = async () => {
    if (editMode) {
      const updates = Object.entries(editedCell);
      for (const [studentId, fields] of updates) {
        const student = students.find((s) => s._id === studentId);
        if (!student) continue;

        const updatedStudent = { ...student, ...fields };
        const dataOnly = { ...updatedStudent };
        delete dataOnly._id;

        try {
          const saved = await updateMcaTwoStudent(studentId, { data: dataOnly });
          setStudents((prev) =>
            prev.map((s) =>
              s._id === studentId ? { _id: saved._id, ...saved.data } : s
            )
          );
        } catch (err) {
          console.error(`Error saving student ${studentId}:`, err);
        }
      }
      setEditedCell({});
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
      const result = await addHeader(title);
      setAllColumns((prev) => [...prev, result]);
      setStudents((prev) =>
        prev.map((student) => ({
          ...student,
          [title]: "", // Initialize new column for existing students
        }))
      );
      setNewColumn("");
      setSelectedColumns((prev) => [...prev, title]); // Auto-select new column
    } catch (err) {
      console.error("Failed to add column:", err);
      alert("Failed to add column.");
    }
  };

  /**
   * Add blank student row
   */
  const handleAddStudent = async () => {
    // Determine the next ID based on existing students' IDs
    const currentMaxId = students.reduce((max, student) => {
      const id = parseInt(student.ID, 10);
      return !isNaN(id) ? Math.max(max, id) : max;
    }, 0);

    const newId = currentMaxId + 1;
    const newStudent = { ID: newId.toString() }; // Ensure ID is a string for consistency
    allColumns.forEach((col) => {
      if (col.title !== "ID") newStudent[col.title] = "";
    });

    try {
      const saved = await addMcaTwoStudent({ data: newStudent });
      setStudents((prev) => [...prev, { _id: saved._id, ...saved.data }]);
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

    if (oldTitle === newTitle) {
      handleCloseModal(); // No change, just close
      return;
    }

    if (allColumns.some(col => col.title.toLowerCase() === newTitle.toLowerCase() && col._id !== selectedColumnForAction._id)) {
      alert("A column with this name already exists.");
      return;
    }

    try {
      await updateHeader(selectedColumnForAction._id, newTitle);

      // Update allColumns state
      setAllColumns(prev => prev.map(col =>
        col._id === selectedColumnForAction._id ? { ...col, title: newTitle } : col
      ));

      // Update students data to reflect the new column title (key)
      setStudents(prev => prev.map(student => {
        const newStudent = { ...student };
        if (newStudent.hasOwnProperty(oldTitle)) {
          newStudent[newTitle] = newStudent[oldTitle];
          delete newStudent[oldTitle];
        }
        return newStudent;
      }));

      // Update selectedColumns state
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

    try {
      await deleteHeader(selectedColumnForAction._id);

      // Remove column from allColumns
      setAllColumns(prev => prev.filter(col => col._id !== selectedColumnForAction._id));

      // Remove data for this column from all students
      const columnToDelete = selectedColumnForAction.title;
      setStudents(prev => prev.map(student => {
        const newStudent = { ...student };
        delete newStudent[columnToDelete];
        return newStudent;
      }));

      // Remove column from selectedColumns if it was selected
      setSelectedColumns(prev => prev.filter(title => title !== columnToDelete));

      alert(`Column "${columnToDelete}" deleted successfully.`);
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
    // Clear any existing timer to prevent multiple modals
    clearTimeout(longPressTimer.current);
    // Start a new timer
    longPressTimer.current = setTimeout(() => {
      // Open modal only if the column is not 'ID'
      if (column.title !== "ID") {
        handleOpenModal(column);
      } else {
        alert("The 'ID' column cannot be renamed or deleted.");
      }
    }, LONG_PRESS_DURATION);
  };

  const handlePressEnd = () => {
    // Clear the timer whether it completed or not
    clearTimeout(longPressTimer.current);
  };

  // Clear timer if mouse leaves the element
  const handleMouseLeave = () => {
    clearTimeout(longPressTimer.current);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      clearTimeout(longPressTimer.current);
    };
  }, []);


  return (
    <section id="mcatwo">
      <div className="container mt-5">
        <h1>MCA Management System</h1>

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
                            displayedStudents,
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
                          exportToExcel(displayedStudents, "Mca_2_all.xlsx")
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
            <input
              type="text"
              className="search_input form-control w-50 border-0 glass_card text-dark"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
            <h3 className="clr-three text-center">MCA II Student Details</h3>
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
                      style={{ cursor: col.title === "ID" ? "default" : "pointer" }} // Change cursor for editable columns
                    >
                      {col.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedStudents.map((student, i) => (
                  <tr key={student._id || i}>
                    {allColumns.map((col, idx) => (
                      <td
                        key={col._id}
                        className={
                          idx === 0 ? "sticky-col" : idx === 1 ? "sticky-col-2" : ""
                        }
                      >
                        {editMode ? (
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={
                              editedCell[student._id]?.[col.title] ??
                              student[col.title] ??
                              ""
                            }
                            onChange={(e) => {
                              const value = e.target.value;
                              setEditedCell((prev) => ({
                                ...prev,
                                [student._id]: {
                                  ...prev[student._id],
                                  [col.title]: value,
                                },
                              }));
                            }}
                          />
                        ) : (
                          student[col.title] ?? ""
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

export default McaTwo;