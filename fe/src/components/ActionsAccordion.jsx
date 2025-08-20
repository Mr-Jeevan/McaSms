import React from 'react';

const ActionsAccordion = ({
  newColumn,
  onNewColumnChange,
  onAddColumn,
  onExportFiltered,
  onExportAll,
  allColumns,
  selectedColumns,
  onCheckboxChange,
}) => {
  return (
    <div className="accordion accordion-flush shadow-sm rounded bg-light" id="actionsAccordion">
      <div className="accordion-item rounded shadow-none ">
        <h2 className="accordion-header">
          <button
            className="accordion-button shadow-none activeBtnFour collapsed bg-four rounded"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseActions"
          >
            <div className="txt-bold">ACTIONS</div>
          </button>
        </h2>
        <div id="collapseActions" className="accordion-collapse collapse rounded">
          <div className="accordion-body bg-light">
            <div className="row">
              {/* Add Column */}
              <div className="col-md-6 mb-3">
                <div className="input-group w-50">
                  <input
                    type="text"
                    className="form-control bg-mid activeInputMid shadow-none txt-gray"
                    placeholder="Enter new column name"
                    value={newColumn}
                    onChange={onNewColumnChange}
                  />
                  <button className="btn bg-one hoverBtn text-white" onClick={onAddColumn}>
                    Add Column
                  </button>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="col-md-6 mb-3">
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button className="btn hoverBtn bg-one text-white" onClick={onExportFiltered}>
                    Export Selected
                  </button>
                  <button className="btn hoverBtn bg-mid" onClick={onExportAll}>
                    Export All
                  </button>
                </div>
              </div>
            </div>

            {/* Column Selection */}
            <div className="table-responsive">
              <table className="table borderless-row bg-transparent">
                <tbody>
                  {Array.from({ length: Math.ceil(allColumns.length / 4) }, (_, rowIndex) => (
                    <tr key={rowIndex}>
                      {Array.from({ length: 4 }, (_, colIndex) => {
                        const index = colIndex * Math.ceil(allColumns.length / 4) + rowIndex;
                        const col = allColumns[index];
                        return col ? (
                          <td key={col._id} className="align-middle" style={{ cursor: "pointer" }}>
                            <div className="form-check d-flex align-items-center gap-2">
                              <input
                                type="checkbox"
                                className="form-check-input shadow-none darkInput"
                                id={`check-${col._id}`}
                                checked={selectedColumns.includes(col.title)}
                                onChange={() => onCheckboxChange(col.title)}
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
  );
};

export default ActionsAccordion;
