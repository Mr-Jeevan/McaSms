const ApiResponse = require('../utils/api-response');

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Firebase errors
  if (err.code) {
    switch (err.code) {
      case 'permission-denied':
        return ApiResponse.forbidden(res, 'Permission denied to access this resource');
      case 'not-found':
        return ApiResponse.notFound(res, 'Resource not found');
      case 'already-exists':
        return ApiResponse.conflict(res, 'Resource already exists');
      case 'failed-precondition':
        return ApiResponse.badRequest(res, 'Failed precondition');
      case 'unauthenticated':
        return ApiResponse.unauthorized(res, 'Authentication required');
      default:
        return ApiResponse.error(res, 'Database operation failed', 500, err.message);
    }
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return ApiResponse.validationError(res, 'Validation failed', err.errors);
  }

  // JSON parsing errors
  if (err.type === 'entity.parse.failed') {
    return ApiResponse.badRequest(res, 'Invalid JSON format');
  }

  // Request size errors
  if (err.type === 'entity.too.large') {
    return ApiResponse.badRequest(res, 'Request entity too large');
  }

  // Default error response
  return ApiResponse.error(res, 'Internal server error', 500, process.env.NODE_ENV === 'development' ? err.message : null);
};

/**
 * 404 handler middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const notFoundHandler = (req, res, next) => {
  return ApiResponse.notFound(res, `Route ${req.originalUrl} not found`);
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors automatically
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Wrapped function
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler
};
