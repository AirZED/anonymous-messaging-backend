const AppError = require('../utils/appError');

const handleJWTExpireError = (err) => new AppError('jwt has expired', 404);

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (err) =>
  new AppError('Invalid token. Please log in again', 401);

// HANDLE PRODUCTION ERROR
const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.errorMessage,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'something went very wrong',
    });
  }
};

// HANDLE DEVELOPMENT ERROR
const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err: err,
  });
};

// GLOBAL ERROR HANDLER FUNCTION
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return sendDevError(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB();
    if (error.code === 11000) error = handleDuplicateFieldsDB();
    if (error.name === 'ValidationError') error = handleValidationErrorDB();
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpireError();

    sendProdError(error, res);
    return;
  }
};

module.exports = globalErrorHandler;
