const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error(`Unhandled error during ${req.method} ${req.url}:`, err);

  const statusCode = err.statusCode || (err.name === 'ZodError' ? 400 : 500);
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      details: err.details || (err.errors ? err.errors : null),
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  });
}

module.exports = errorHandler;
