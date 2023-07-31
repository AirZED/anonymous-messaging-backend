class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.errorMessage = message;

    this.status = `${statusCode}`.startsWith('4') ? 'failed' : 'error';
    this.statusCode = statusCode;
    this.isOperational = true;

    //this removes this class from the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
