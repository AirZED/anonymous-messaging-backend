const rateLimit = require('express-rate-limit');
const express = require('express');
const morgan = require('morgan');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const helmet = require('helmet');

// importing utils
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// importing routes
const userRouter = require(`./routes/userRoute`);
const messageRouter = require(`./routes/messageRoute`);

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.set('trust proxy', false);
// protection against http attacks
app.use(helmet());

const limiter = rateLimit({
  windowsMs: 30 * 60 * 100,
  message: 'Too many request from this IP, Please try again in 30 mins',
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// parses the body
app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));

// data sanitization against no-sql query attack
app.use(mongoSanitize());

// sanitize against xss attacks
app.use(xss());

// Mounting routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/message', messageRouter);

app.all('*', (req, res, next) => {
  return next(new AppError(`${req.originalUrl} can't be founc on server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
