const AppError = require('../utils/appError');

// if (err.name === 'TokenExpiredError') new AppError('jwt has expired', 404);

// HANDLE PRODUCTION ERROR
const sendProdError = (err, res) => {
  console.log(err);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      error: err,
      status: err.status,
      message: err.message,
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

  if (process.send.NODE_ENV === 'production') {
    return sendProdError(err, res);
  }
};

module.exports = globalErrorHandler;
