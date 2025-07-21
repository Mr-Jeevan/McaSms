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
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,\
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
export const addMcaTwoStudent = (studentData) => apiRequest(API_ENDPOINTS.mcaTwoStudents, 'POST', studentData);
export const updateMcaTwoStudent = (id, studentData) => apiRequest(`${API_ENDPOINTS.mcaTwoStudents}/${id}`, 'PUT', studentData);
export const deleteMcaTwoStudent = (id) => apiRequest(`${API_ENDPOINTS.mcaTwoStudents}/${id}`, 'DELETE');

// --- API Functions for MCA One Students (for future use in McaOne.jsx) ---
export const getMcaOneStudents = () => apiRequest(API_ENDPOINTS.mcaOneStudents);
export const addMcaOneStudent = (studentData) => apiRequest(API_ENDPOINTS.mcaOneStudents, 'POST', studentData);
export const updateMcaOneStudent = (id, studentData) => apiRequest(`${API_ENDPOINTS.mcaOneStudents}/${id}`, 'PUT', studentData);
export const deleteMcaOneStudent = (id) => apiRequest(`${API_ENDPOINTS.mcaOneStudents}/${id}`, 'DELETE');

// --- API Functions for Headers ---
export const getHeaders = () => apiRequest(API_ENDPOINTS.headers);
export const addHeader = (title) => apiRequest(API_ENDPOINTS.headers, 'POST', { title });
export const updateHeader = (id, newTitle) => apiRequest(`${API_ENDPOINTS.headers}/${id}`, 'PUT', { title: newTitle }); // Added/Confirmed
export const deleteHeader = (id) => apiRequest(`${API_ENDPOINTS.headers}/${id}`, 'DELETE'); // Added/Confirmed