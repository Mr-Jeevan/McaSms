import React from 'react';

const ControlBar = ({
  searchTerm,
  onSearchChange,
  filterColumn,
  onFilterChange,
  allColumns,
  onAddStudent,
  onEditToggle,
  editMode,
}) => {
  return (
    <div className="row my-3 align-items-center">
      {/* Search Input */}
      <div className="col-md-6 col-lg-4 mb-3 mb-md-0">
        <div className="input-group">
          <input
            type="text"
            className="search_input form-control border-0 glass_card text-dark"
            placeholder="Search..."
            value={searchTerm}
            onChange={onSearchChange}
          />
          <select
            className="form-select border-0 glass_card text-light ms-2"
            value={filterColumn}
            onChange={onFilterChange}
          >
            <option value="All Columns">Search All Columns</option>
            {allColumns.map(col => (
              <option key={col._id} value={col.title}>{col.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="col-md-6 col-lg-8 d-flex justify-content-end gap-2 mb-3 mb-md-0">
        <button
          className="btn transparent_input flex-grow-1 flex-md-grow-0"
          onClick={onAddStudent}
        >
          ➕ Add Student
        </button>
        <button
          className="btn bg-mid flex-grow-1 flex-md-grow-0"
          onClick={onEditToggle}
        >
          {editMode ? "Disable Edit" : "Enable Edit"}
        </button>
      </div>
    </div>
  );
};

export default ControlBar;
