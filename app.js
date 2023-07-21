const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const userRouter = require(`./routes/userRoute`);
const messageRouter = require(`./routes/messageRoute`);

// parses the body
app.use(express.json());

// Mounting routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/message', messageRouter);

app.all('*', (req, res, next) => {
  return next(new AppError(`${req.originalUrl} can't be founc on server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
