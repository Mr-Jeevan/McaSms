/**
 * Validation utility for API inputs
 */

class Validation {
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  static isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   * @param {string} phone - Phone number to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  static isValidPhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate required fields
   * @param {Object} data - Data object to validate
   * @param {Array} requiredFields - Array of required field names
   * @returns {Object} - Validation result with errors if any
   */
  static validateRequired(data, requiredFields) {
    const errors = [];
    
    for (const field of requiredFields) {
      if (!data[field] || data[field].toString().trim() === '') {
        errors.push(`${field} is required`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate string length
   * @param {string} str - String to validate
   * @param {number} min - Minimum length
   * @param {number} max - Maximum length
   * @returns {boolean} - True if valid, false otherwise
   */
  static isValidLength(str, min = 0, max = 255) {
    if (!str || typeof str !== 'string') return false;
    const length = str.trim().length;
    return length >= min && length <= max;
  }

  /**
   * Validate header title
   * @param {string} title - Header title to validate
   * @returns {Object} - Validation result
   */
  static validateHeaderTitle(title) {
    const errors = [];
    
    if (!title || typeof title !== 'string') {
      errors.push('Title is required');
    } else {
      const trimmed = title.trim();
      if (trimmed.length === 0) {
        errors.push('Title cannot be empty');
      } else if (trimmed.length > 100) {
        errors.push('Title cannot exceed 100 characters');
      } else if (trimmed.length < 2) {
        errors.push('Title must be at least 2 characters long');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate student data
   * @param {Object} studentData - Student data to validate
   * @returns {Object} - Validation result
   */
  static validateStudentData(studentData) {
    const errors = [];
    
    if (!studentData || typeof studentData !== 'object') {
      errors.push('Student data is required');
      return { isValid: false, errors };
    }
    
    if (!studentData.data || typeof studentData.data !== 'object') {
      errors.push('Student data.data is required');
      return { isValid: false, errors };
    }
    
    const data = studentData.data;
    
    // Validate each field if it exists
    Object.keys(data).forEach(key => {
      const value = data[key];
      
      if (value && typeof value === 'string') {
        // Check for reasonable length
        if (value.length > 500) {
          errors.push(`${key} cannot exceed 500 characters`);
        }
        
        // Validate email format if field name suggests it's an email
        if (key.toLowerCase().includes('email') && !this.isValidEmail(value)) {
          errors.push(`${key} must be a valid email address`);
        }
        
        // Validate phone format if field name suggests it's a phone
        if (key.toLowerCase().includes('phone') && !this.isValidPhone(value)) {
          errors.push(`${key} must be a valid phone number`);
        }
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize string input
   * @param {string} input - Input string to sanitize
   * @returns {string} - Sanitized string
   */
  static sanitizeString(input) {
    if (!input || typeof input !== 'string') return '';
    return input.trim().replace(/[<>]/g, '');
  }

  /**
   * Validate pagination parameters
   * @param {Object} params - Pagination parameters
   * @returns {Object} - Validation result with sanitized values
   */
  static validatePagination(params) {
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    
    const errors = [];
    
    if (page < 1) {
      errors.push('Page must be greater than 0');
    }
    
    if (limit < 1 || limit > 100) {
      errors.push('Limit must be between 1 and 100');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      page: Math.max(1, page),
      limit: Math.min(100, Math.max(1, limit))
    };
  }

  /**
   * Validate Firebase document ID
   * @param {string} id - Document ID to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  static isValidFirebaseId(id) {
    if (!id || typeof id !== 'string') return false;
    // Firebase document IDs should be non-empty strings without certain characters
    const firebaseIdRegex = /^[a-zA-Z0-9_-]+$/;
    return id.length <= 1500 && firebaseIdRegex.test(id);
  }
}

module.exports = Validation;
