import React from 'react';
import StudentDataPage from '../StudentDataPage'; // Adjust path if necessary
import {
  getMcaOneStudents,
  addMcaOneStudent,
  updateMcaOneStudent,
  deleteMcaOneStudent,
} from '../../services/apiService';

const McaOne = () => {
  // Define the API functions for this specific page
  const mcaOneApi = {
    getStudents: getMcaOneStudents,
    addStudent: addMcaOneStudent,
    updateStudent: updateMcaOneStudent,
    deleteStudent: deleteMcaOneStudent,
  };

  return (
    <StudentDataPage
      title="MCA I Management System"
      api={mcaOneApi}
    />
  );
};

export default McaOne;
