// src/services/apiService.js
import API_ENDPOINTS from '../config/apiconfig'; // Correct path to your API_ENDPOINTS

/**
 * Generic API request handler.
 * @param {string} url - The full API endpoint URL.
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE).
 * @param {object|null} data - Request body data (for POST/PUT).
 * @returns {Promise<object>} - The JSON response from the API.
 */
const apiRequest = async (url, method = 'GET', data = null) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            // Add any authorization headers here if you implement authentication later
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            // Attempt to read error message from backend
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error; // Re-throw to be caught by the component
    }
};

// --- API Functions for MCA Two Students ---
export const getMcaTwoStudents = () => apiRequest(API_ENDPOINTS.mcaTwoStudents);

// CHANGE THIS LINE: Pass studentData directly as the payload to apiRequest
// McaTwo.jsx already sends { data: newStudent }, so apiRequest will receive this
export const addMcaTwoStudent = (studentData) => apiRequest(API_ENDPOINTS.mcaTwoStudents, 'POST', studentData);

// CHANGE THIS LINE: Pass studentData directly as the payload to apiRequest
// McaTwo.jsx already sends { data: dataOnly }, so apiRequest will receive this
export const updateMcaTwoStudent = (id, studentData) => apiRequest(`${API_ENDPOINTS.mcaTwoStudents}/${id}`, 'PUT', studentData);

export const deleteMcaTwoStudent = (id) => apiRequest(`${API_ENDPOINTS.mcaTwoStudents}/${id}`, 'DELETE'); // Example delete

// --- API Functions for MCA One Students (for future use in McaOne.jsx) ---
export const getMcaOneStudents = () => apiRequest(API_ENDPOINTS.mcaOneStudents);

// CHANGE THIS LINE:
export const addMcaOneStudent = (studentData) => apiRequest(API_ENDPOINTS.mcaOneStudents, 'POST', studentData);

// CHANGE THIS LINE:
export const updateMcaOneStudent = (id, studentData) => apiRequest(`${API_ENDPOINTS.mcaOneStudents}/${id}`, 'PUT', studentData);

export const deleteMcaOneStudent = (id) => apiRequest(`${API_ENDPOINTS.mcaOneStudents}/${id}`, 'DELETE'); // Example delete

// --- API Functions for Headers ---
export const getHeaders = () => apiRequest(API_ENDPOINTS.headers);
export const addHeader = (title) => apiRequest(API_ENDPOINTS.headers, 'POST', { title });
export const updateHeader = (id, newTitle) => apiRequest(`${API_ENDPOINTS.headers}/${id}`, 'PUT', { title: newTitle }); // Example update
export const deleteHeader = (id) => apiRequest(`${API_ENDPOINTS.headers}/${id}`, 'DELETE'); // Example delete