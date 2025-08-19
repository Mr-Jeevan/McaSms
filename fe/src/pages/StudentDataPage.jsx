import { useState, useEffect, useRef } from "react";
import { exportToExcel, exportFilteredToExcel } from "../utils/ExportToExcel";
import { getHeaders, addHeader, updateHeader, deleteHeader } from "../services/apiService";

import ColumnActionModal from "../components/Modal/ColumnModal/ColumnActionModal";
import ActionsAccordion from "../components/ActionsAccordion";
import ControlBar from "../components/ControlBar";
import StudentTable from "../components/StudentTable";

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
  const [idToTitleMap, setIdToTitleMap] = useState(new Map());

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const headerData = await getHeaders();
        const studentData = await api.getStudents();
        
        const newTitleToIdMap = new Map(headerData.map(col => [col.title, col._id]));
        const newIdToTitleMap = new Map(headerData.map(col => [col._id, col.title]));
        setTitleToIdMap(newTitleToIdMap);
        setIdToTitleMap(newIdToTitleMap);
        setAllColumns(headerData);
        setStudents(studentData.map(s => ({ _id: s._id, data: s.data || {} })));

        // --- FIX: Select the first 3 columns by default ---
        const initialSelected = headerData.slice(0, 3).map((col) => col.title);
        setSelectedColumns(initialSelected);
      } catch (err) {
        console.error("Failed to load initial data:", err);
      }
    };
    fetchInitialData();
  }, [api]);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => clearTimeout(longPressTimer.current);
  }, []);

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
      setIdToTitleMap(prev => new Map(prev).set(result._id, result.title));
      
      // Initialize the new column for all existing students
      setStudents((prevStudents) =>
        prevStudents.map((student) => ({
          ...student,
          data: {
            ...(student.data || {}),
            [result._id]: "", // Add the new column with an empty value
          },
        }))
      );

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
  
  const handleCellChange = (studentId, columnId, value) => {
    setEditedCell((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [columnId]: value,
      },
    }));
  };

  // --- MODAL AND LONG PRESS HANDLERS ---
  const handleOpenModal = (column) => {
    setSelectedColumnForAction(column);
    setRenameInputValue(column.title);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedColumnForAction(null);
    setRenameInputValue("");
  };

  const handleRenameColumn = async () => {
    if (!selectedColumnForAction || !renameInputValue.trim()) return;
    const oldTitle = selectedColumnForAction.title;
    const newTitle = renameInputValue.trim();
    const columnId = selectedColumnForAction._id;

    try {
      await updateHeader(columnId, newTitle);
      setAllColumns(prev => prev.map(col => col._id === columnId ? { ...col, title: newTitle } : col));
      setTitleToIdMap(prev => {
        const newMap = new Map(prev);
        newMap.delete(oldTitle);
        newMap.set(newTitle, columnId);
        return newMap;
      });
      setIdToTitleMap(prev => new Map(prev).set(columnId, newTitle));
      setSelectedColumns(prev => prev.map(title => title === oldTitle ? newTitle : title));
      handleCloseModal();
    } catch (error) {
      console.error("Error renaming column:", error);
    }
  };

  const handleDeleteColumn = async () => {
    if (!selectedColumnForAction || selectedColumnForAction.title === "ID") return;
    if (!window.confirm(`Delete "${selectedColumnForAction.title}"?`)) return;

    const columnToDeleteId = selectedColumnForAction._id;
    const columnToDeleteTitle = selectedColumnForAction.title;

    try {
      await deleteHeader(columnToDeleteId);
      setAllColumns(prev => prev.filter(col => col._id !== columnToDeleteId));
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
      setStudents(prev => prev.map(student => {
        const newStudentData = { ...student.data };
        delete newStudentData[columnToDeleteId];
        return { ...student, data: newStudentData };
      }));
      setSelectedColumns(prev => prev.filter(title => title !== columnToDeleteTitle));
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting column:", error);
    }
  };

  const handlePressStart = (column) => {
    clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => {
      if (column.title !== "ID") handleOpenModal(column);
    }, LONG_PRESS_DURATION);
  };

  const handlePressEnd = () => clearTimeout(longPressTimer.current);
  const handlePressLeave = () => clearTimeout(longPressTimer.current);

  return (
    <section>
      <div className="container mt-5">
        <h1>{title}</h1>
        <ActionsAccordion
            newColumn={newColumn}
            onNewColumnChange={(e) => setNewColumn(e.target.value)}
            onAddColumn={handleAddColumn}
            // Add export handlers here if needed
            onExportFiltered={() => {}}
            onExportAll={() => {}}
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
            onHeaderPressStart={handlePressStart}
            onHeaderPressEnd={handlePressEnd}
            onHeaderPressLeave={handlePressLeave}
        />
      </div>
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

export default StudentDataPage;
