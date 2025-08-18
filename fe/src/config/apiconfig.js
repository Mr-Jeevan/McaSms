const API_BASE_URL = 
  process.env.NODE_ENV === "production"
    ? "https://mcasms.onrender.com/api"
    : "http://localhost:4000/api";

const API_ENDPOINTS = {
  headers: `${API_BASE_URL}/headers`,
  mcaOneStudents: `${API_BASE_URL}/mcaone/students`,
  mcaTwoStudents: `${API_BASE_URL}/mcatwo/students`,
};


export default API_ENDPOINTS;