class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.status = `${statusCode}`.startsWith('4') ? 'failed' : 'error';
    this.statusCode = statusCode;

    //this removes this class from the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
