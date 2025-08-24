import React from 'react';
import "../GlobalCss/index.css"
import "../GlobalCss/studentTable.css"

const StudentTable = ({
  students,
  columns,
  editMode,
  editedCell,
  onCellChange,
  onHeaderDoubleClick,
  onRowDoubleClick,
}) => {
  return (
    // The main card container no longer needs scrolling classes
    <section id='studentTable'>
      <div className="glass_card p-2 pt-2 rounded">

        {/* 1. The title is now outside the scrollable area */}
        <div>
          <h3 className="clr-three text-center">Student Details</h3>
        </div>

        {/* 2. This new div makes ONLY the table scrollable */}
        <div className="table-responsive">
          <table className="table table-striped borderless-row mb-0">
            <thead className="tHeadBg">
              <tr >
                {columns.map((col, idx) => (
                  <th
                    key={col._id}
                    className={idx === 0 ? "sticky-col" : idx === 1 ? "sticky-col-2" : ""}
                    onDoubleClick={() => onHeaderDoubleClick(col)}
                    style={{ cursor: col.title === "ID" ? "default" : "pointer" }}
                  >
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className=''>
              {students.map((student, i) => (
                <tr key={student._id || i} onDoubleClick={() => onRowDoubleClick(student)}>
                  {columns.map((col, idx) => (
                    <td
                      key={col._id}
                      // These class names are correct
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
    </section>
  );
};

export default StudentTable;