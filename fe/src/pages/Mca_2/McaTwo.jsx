import React from 'react';
import StudentDataPage from '../StudentDataPage'; // Adjust path if necessary
import {
  getMcaTwoStudents,
  addMcaTwoStudent,
  updateMcaTwoStudent,
  deleteMcaTwoStudent,
} from '../../services/apiService';

const McaTwo = () => {
  // Define the API functions for this specific page
  const mcaTwoApi = {
    getStudents: getMcaTwoStudents,
    addStudent: addMcaTwoStudent,
    updateStudent: updateMcaTwoStudent,
    deleteStudent: deleteMcaTwoStudent,
  };

  return (
    <StudentDataPage
      title="MCA II Management System"
      api={mcaTwoApi}
    />
  );
};

export default McaTwo;
