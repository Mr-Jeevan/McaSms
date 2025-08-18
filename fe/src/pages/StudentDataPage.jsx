import { useState, useEffect, useRef } from "react";
import { exportToExcel, exportFilteredToExcel } from "../utils/ExportToExcel";
import { getHeaders, addHeader, updateHeader, deleteHeader } from "../../services/apiService";

import ColumnActionModal from "../../components/Modal/ColumnModal/ColumnActionModal";
import ActionsAccordion from "../../components/ActionsAccordion";
import ControlBar from "../../components/ControlBar";
import StudentTable from "../../components/StudentTable";

// This is the generic, reusable component
const StudentDataPage = ({ title, api }) => {
  const [students, setStudents] = useState([]);
  const [allColumns, setAllColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newColumn, setNewColumn] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedCell, setEditedCell] = useState({});
  const [filterColumnTitle, setFilterColumnTitle] = useState("All Columns");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumnForAction, setSelectedColumnForAction] = useState(null);
  const [renameInputValue, setRenameInputValue] = useState("");
  const longPressTimer = useRef(null);
  const LONG_PRESS_DURATION = 700;
  const [titleToIdMap, setTitleToIdMap] = useState(new Map());

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const headerData = await getHeaders();
        const studentData = await api.getStudents();
        
        const newTitleToIdMap = new Map(headerData.map(col => [col.title, col._id]));
        setTitleToIdMap(newTitleToIdMap);
        setAllColumns(headerData);
        setStudents(studentData.map(s => ({ _id: s._id, data: s.data || {} })));

        const initialSelected = headerData.slice(0, 4).map((col) => col.title);
        setSelectedColumns(initialSelected);
      } catch (err) {
        console.error("Failed to load initial data:", err);
      }
    };
    fetchInitialData();
  }, [api]);

  const displayedStudents = students.filter((student) => {
    if (!searchTerm) return true;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    if (filterColumnTitle === "All Columns") {
      return allColumns.some((col) =>
        String(student.data[col._id] ?? "").toLowerCase().includes(lowerCaseSearchTerm)
      );
    } else {
      const columnIdToFilter = titleToIdMap.get(filterColumnTitle);
      return String(student.data[columnIdToFilter] ?? "").toLowerCase().includes(lowerCaseSearchTerm);
    }
  });

  const handleEditToggle = async () => {
    if (editMode) {
      for (const [studentId, fields] of Object.entries(editedCell)) {
        const studentToUpdate = students.find((s) => s._id === studentId);
        if (studentToUpdate) {
          const updatedDataMap = { ...studentToUpdate.data, ...fields };
          try {
            const saved = await api.updateStudent(studentId, { data: updatedDataMap });
            setStudents((prev) => prev.map((s) => (s._id === studentId ? { ...s, data: saved.data } : s)));
          } catch (err) {
            console.error(`Error saving student ${studentId}:`, err);
          }
        }
      }
      setEditedCell({});
    }
    setEditMode((prev) => !prev);
  };
  
  const handleAddColumn = async () => {
    const title = newColumn.trim();
    if (!title || allColumns.some((c) => c.title.toLowerCase() === title.toLowerCase())) {
      alert("Column name cannot be empty or a duplicate.");
      return;
    }
    try {
      const result = await addHeader(title);
      setAllColumns((prev) => [...prev, result]);
      setTitleToIdMap(prev => new Map(prev).set(result.title, result._id));
      setNewColumn("");
      setSelectedColumns((prev) => [...prev, result.title]);
    } catch (err) {
      console.error("Failed to add column:", err);
    }
  };

  const handleAddStudent = async () => {
    const newStudentData = {};
    allColumns.forEach((col) => { newStudentData[col._id] = ""; });
    try {
      const saved = await api.addStudent({ data: newStudentData });
      setStudents((prev) => [...prev, { _id: saved._id, data: saved.data || {} }]);
    } catch (err) {
      console.error("Failed to add student:", err);
    }
  };

  // ... (Add other handlers like handleRenameColumn, handleDeleteColumn, long press, etc. here)
  // These can be copied directly from your original McaTwo.jsx file as they are generic.
  
  const handleCellChange = (studentId, columnId, value) => {
    setEditedCell((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [columnId]: value,
      },
    }));
  };

  return (
    <section>
      <div className="container mt-5">
        <h1>{title}</h1>
        <ActionsAccordion
            newColumn={newColumn}
            onNewColumnChange={(e) => setNewColumn(e.target.value)}
            onAddColumn={handleAddColumn}
            // Add export handlers
            allColumns={allColumns}
            selectedColumns={selectedColumns}
            onCheckboxChange={(title) => setSelectedColumns(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title])}
        />
        <ControlBar
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            filterColumn={filterColumnTitle}
            onFilterChange={(e) => setFilterColumnTitle(e.target.value)}
            allColumns={allColumns}
            onAddStudent={handleAddStudent}
            onEditToggle={handleEditToggle}
            editMode={editMode}
        />
        <StudentTable
            students={displayedStudents}
            columns={allColumns.filter(c => selectedColumns.includes(c.title))}
            editMode={editMode}
            editedCell={editedCell}
            onCellChange={handleCellChange}
            // Add long press handlers
        />
      </div>
      {/* ... (Modal logic) */}
    </section>
  );
};

export default StudentDataPage;
