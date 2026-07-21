// Wraps async route handlers so thrown/rejected errors reach errorHandler
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Centralized Express error handler (4-arg signature is required by Express)
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = status === 500 ? "Internal server error" : err.message;
  if (status === 500) {
    console.error(err);
  }
  res.status(status).json({ error: message });
}
