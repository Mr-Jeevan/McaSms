/**
 * Standardized API Response Utility
 * Provides consistent response format across all API endpoints
 */

class ApiResponse {
  /**
   * Success response
   * @param {Object} res - Express response object
   * @param {*} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code (default: 200)
   */
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code (default: 500)
   * @param {*} error - Error details (optional)
   */
  static error(res, message = 'Internal Server Error', statusCode = 500, error = null) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString()
    };

    // Only include error details in development mode
    if (process.env.NODE_ENV === 'development' && error) {
      response.error = error;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Created response (201)
   * @param {Object} res - Express response object
   * @param {*} data - Created resource data
   * @param {string} message - Success message
   */
  static created(res, data, message = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }

  /**
   * No content response (204)
   * @param {Object} res - Express response object
   */
  static noContent(res) {
    return res.status(204).send();
  }

  /**
   * Bad request response (400)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {*} error - Error details (optional)
   */
  static badRequest(res, message = 'Bad Request', error = null) {
    return this.error(res, message, 400, error);
  }

  /**
   * Unauthorized response (401)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, message, 401);
  }

  /**
   * Forbidden response (403)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  static forbidden(res, message = 'Forbidden') {
    return this.error(res, message, 403);
  }

  /**
   * Not found response (404)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  }

  /**
   * Conflict response (409)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  static conflict(res, message = 'Conflict') {
    return this.error(res, message, 409);
  }

  /**
   * Validation error response (422)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {*} validationErrors - Validation error details
   */
  static validationError(res, message = 'Validation Error', validationErrors = null) {
    return this.error(res, message, 422, validationErrors);
  }

  /**
   * Paginated response
   * @param {Object} res - Express response object
   * @param {Array} data - Array of items
   * @param {Object} pagination - Pagination info
   * @param {string} message - Success message
   */
  static paginated(res, data, pagination, message = 'Success') {
    return this.success(res, {
      items: data,
      pagination: {
        total: pagination.total || data.length,
        page: pagination.page || 1,
        limit: pagination.limit || data.length,
        totalPages: pagination.totalPages || 1
      }
    }, message);
  }
}

module.exports = ApiResponse;
