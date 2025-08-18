// src/services/apiService.js
import API_ENDPOINTS from '../config/apiconfig'; // Correct path to your API_ENDPOINTS

/**
 * Generic API request handler.
 * It automatically adds the JWT token to the headers if it exists.
 * @param {string} url - The full API endpoint URL.
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE).
 * @param {object|null} data - Request body data (for POST/PUT).
 * @param {boolean} isAuthRequest - Flag to indicate if this is a login/register request.
 * @returns {Promise<object>} - The JSON response from the API.
 */
const apiRequest = async (url, method = 'GET', data = null, isAuthRequest = false) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Add the Authorization header for all requests except login/register
    if (!isAuthRequest) {
        const token = localStorage.getItem('authToken');
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }
    }

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
        // Handle cases where the response might be empty (e.g., DELETE requests)
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return await response.json();
        }
        return {}; // Return an empty object for non-JSON responses

    } catch (error) {
        console.error('API request failed:', error);
        throw error; // Re-throw to be caught by the component
    }
};

  // --- Authentication Functions ---
  export const loginUser = (credentials) => apiRequest(API_ENDPOINTS.login, 'POST', credentials, true);
  export const registerUser = (userData) => apiRequest(API_ENDPOINTS.register, 'POST', userData, true);


// --- API Functions for MCA Two Students ---
export const getMcaTwoStudents = () => apiRequest(API_ENDPOINTS.mcaTwoStudents);
export const addMcaTwoStudent = (studentData) => apiRequest(API_ENDPOINTS.mcaTwoStudents, 'POST', studentData);
export const updateMcaTwoStudent = (id, studentData) => apiRequest(`${API_ENDPOINTS.mcaTwoStudents}/${id}`, 'PUT', studentData);
export const deleteMcaTwoStudent = (id) => apiRequest(`${API_ENDPOINTS.mcaTwoStudents}/${id}`, 'DELETE');

// --- API Functions for MCA One Students ---
export const getMcaOneStudents = () => apiRequest(API_ENDPOINTS.mcaOneStudents);
export const addMcaOneStudent = (studentData) => apiRequest(API_ENDPOINTS.mcaOneStudents, 'POST', studentData);
export const updateMcaOneStudent = (id, studentData) => apiRequest(`${API_ENDPOINTS.mcaOneStudents}/${id}`, 'PUT', studentData);
export const deleteMcaOneStudent = (id) => apiRequest(`${API_ENDPOINTS.mcaOneStudents}/${id}`, 'DELETE');

// --- API Functions for Headers ---
export const getHeaders = () => apiRequest(API_ENDPOINTS.headers);
export const addHeader = (title) => apiRequest(API_ENDPOINTS.headers, 'POST', { title });
export const updateHeader = (id, newTitle) => apiRequest(`${API_ENDPOINTS.headers}/${id}`, 'PUT', { title: newTitle });
export const deleteHeader = (id) => apiRequest(`${API_ENDPOINTS.headers}/${id}`, 'DELETE');
