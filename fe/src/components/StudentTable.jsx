import React from 'react';

const StudentTable = ({
  students,
  columns,
  editMode,
  editedCell,
  onCellChange,
  onHeaderPressStart,
  onHeaderPressEnd,
  onHeaderPressLeave,
}) => {
  return (
    <div className="overflow-auto table-responsive glass_card p-2 pt-2 rounded">
      <div className="text-">
        <h3 className="clr-three text-center">Student Details</h3>
      </div>
      <div className="overflow-hidden">
        <table className="table borderless-row table-light mb-0">
          <thead className="bg-mid" style={{ color: "white" }}>
            <tr className="bg-mid">
              {columns.map((col, idx) => (
                <th
                  key={col._id}
                  className={idx === 0 ? "sticky-col" : idx === 1 ? "sticky-col-2" : ""}
                  onMouseDown={() => onHeaderPressStart(col)}
                  onMouseUp={onHeaderPressEnd}
                  onMouseLeave={onHeaderPressLeave}
                  onTouchStart={() => onHeaderPressStart(col)}
                  onTouchEnd={onHeaderPressEnd}
                  style={{ cursor: col.title === "ID" ? "default" : "pointer" }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student, i) => (
              <tr key={student._id || i}>
                {columns.map((col, idx) => (
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
                        onChange={(e) => onCellChange(student._id, col._id, e.target.value)}
                      />
                    ) : (
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
  );
};

export default StudentTable;
