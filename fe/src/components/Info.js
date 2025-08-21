import React, { useState } from 'react';
import info from '../assets/imgs/info.png';

const Info = () => {
    // State to control the modal's visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Functions to handle opening and closing the modal
    const handleShowModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <>
            {/* Info Icon Button */}
            <div className="position-fixed bottom-0 end-0"> {/* Corrected: top-50 */}
                <div className="info-container d-flex justify-content-end m-3 align-items-center">
                    {/* The button now uses an onClick event to update state */}
                        <img style={{ cursor: 'pointer', values: 'auto default pointer wait text move help not-allowed' }}  onClick={handleShowModal} width="40px" src={info} alt="info" title="Information" />
                </div>
            </div>

            {/* Modal */}
            {/* Conditionally apply 'show' class and an inline style to display the modal.
              This is how React state controls the modal's appearance.
            */}
            <div 
                className={`modal fade ${isModalOpen ? 'show' : ''}`}
                style={{ display: isModalOpen ? 'block' : 'none' }}
                tabIndex="-1" 
                role="dialog" 
                aria-labelledby="exampleModalLongTitle" 
                aria-hidden={!isModalOpen}
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Modal title</h5>
                        </div>
                        <div className="modal-body">
                            Your modal content goes here...
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Optional: Add a backdrop when the modal is open */}
            {isModalOpen && <div className="modal-backdrop fade show"></div>}
        </>
    );
}

export default Info;