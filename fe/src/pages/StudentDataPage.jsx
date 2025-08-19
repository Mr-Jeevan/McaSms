import { useState, useEffect, useRef } from "react";
import { exportToExcel, exportFilteredToExcel } from "../utils/ExportToExcel";
import { getHeaders, addHeader, updateHeader, deleteHeader } from "../services/apiService";

import ColumnActionModal from "../components/Modal/ColumnModal/ColumnActionModal";
import StudentActionModal from "../components/Modal/StudentModal/StudentActionModal"; // Import the student modal
import ActionsAccordion from "../components/ActionsAccordion";
import ControlBar from "../components/ControlBar";
import StudentTable from "../components/StudentTable";

// This is the generic, reusable component
const StudentDataPage = ({ title, api }) => {
  const [students, setStudents] = useState([]);
  const [allColumns, setAllColumns] = useState([]);
  const [columnsForExport, setColumnsForExport] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newColumn, setNewColumn] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedCell, setEditedCell] = useState({});
  const [filterColumnTitle, setFilterColumnTitle] = useState("All Columns");
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [selectedColumnForAction, setSelectedColumnForAction] = useState(null);
  const [renameInputValue, setRenameInputValue] = useState("");
  const longPressTimer = useRef(null);
  const LONG_PRESS_DURATION = 700;
  const [titleToIdMap, setTitleToIdMap] = useState(new Map());
  const [idToTitleMap, setIdToTitleMap] = useState(new Map());

  // State for the student delete modal
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);


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

        const initialExportSelection = headerData.slice(0, 3).map((col) => col.title);
        setColumnsForExport(initialExportSelection);
      } catch (err) {
        console.error("Failed to load initial data:", err);
      }
    };
    fetchInitialData();
  }, [api]);

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
      
      setStudents((prevStudents) =>
        prevStudents.map((student) => ({
          ...student,
          data: {
            ...(student.data || {}),
            [result._id]: "",
          },
        }))
      );

      setNewColumn("");
      setColumnsForExport((prev) => [...prev, result.title]);
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

  const handleExport = (filtered = false) => {
    const dataToExport = displayedStudents.map(student => {
      const exportedStudent = {};
      const columnsToUse = filtered ? allColumns.filter(c => columnsForExport.includes(c.title)) : allColumns;
      
      columnsToUse.forEach(col => {
        exportedStudent[col.title] = student.data[col._id] || "";
      });
      return exportedStudent;
    });

    const headers = filtered ? columnsForExport : allColumns.map(c => c.title);
    const filename = `${title.replace(/\s/g, '_')}_${filtered ? 'selected' : 'all'}.xlsx`;

    if (filtered) {
      exportFilteredToExcel(dataToExport, filename, headers);
    } else {
      exportToExcel(dataToExport, filename);
    }
  };

  // --- STUDENT DELETE LOGIC ---
  const openStudentDeleteModal = (student) => {
    setStudentToDelete(student);
    setIsStudentModalOpen(true);
  };

  const closeStudentDeleteModal = () => {
    setStudentToDelete(null);
    setIsStudentModalOpen(false);
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await api.deleteStudent(studentId);
      setStudents(prev => prev.filter(s => s._id !== studentId));
    } catch (error) {
      console.error("Failed to delete student:", error);
      alert("Failed to delete student.");
    }
  };

  // --- COLUMN MODAL AND LONG PRESS HANDLERS ---
  const handleOpenColumnModal = (column) => {
    setSelectedColumnForAction(column);
    setRenameInputValue(column.title);
    setIsColumnModalOpen(true);
  };

  const handleCloseColumnModal = () => {
    setIsColumnModalOpen(false);
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
      setColumnsForExport(prev => prev.map(title => title === oldTitle ? newTitle : title));
      handleCloseColumnModal();
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
      setColumnsForExport(prev => prev.filter(title => title !== columnToDeleteTitle));
      handleCloseColumnModal();
    } catch (error) {
      console.error("Error deleting column:", error);
    }
  };

  const handlePressStart = (column) => {
    clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => {
      if (column.title !== "ID") handleOpenColumnModal(column);
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
            onExportFiltered={() => handleExport(true)}
            onExportAll={() => handleExport(false)}
            allColumns={allColumns}
            selectedColumns={columnsForExport}
            onCheckboxChange={(title) => setColumnsForExport(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title])}
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
            columns={allColumns}
            editMode={editMode}
            editedCell={editedCell}
            onCellChange={handleCellChange}
            onHeaderPressStart={handlePressStart}
            onHeaderPressEnd={handlePressEnd}
            onHeaderPressLeave={handlePressLeave}
            onRowDoubleClick={openStudentDeleteModal} // Pass the handler to the table
        />
      </div>
      {isColumnModalOpen && selectedColumnForAction && (
        <ColumnActionModal
          column={selectedColumnForAction}
          onClose={handleCloseColumnModal}
          onRename={handleRenameColumn}
          onDelete={handleDeleteColumn}
          renameInputValue={renameInputValue}
          onRenameInputChange={setRenameInputValue}
        />
      )}
      {isStudentModalOpen && studentToDelete && (
        <StudentActionModal
          student={studentToDelete}
          onClose={closeStudentDeleteModal}
          onDelete={handleDeleteStudent}
        />
      )}
    </section>
  );
};

export default StudentDataPage;
