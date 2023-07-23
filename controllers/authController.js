const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendResponseFn = (statusCode, token, data, res) => {
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      data,
    },
  });
};

// SIGNUP CONTROLLER
exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  const token = signToken(user._id);
  sendResponseFn(201, token, user, res);
});

// LOGIN CONTROLLER
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Enter valid email and password', 400));
  }
  // confirm email
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('User does not exist', 404));
  }
  // confirm password
  const isMatch = await user.comparePassword(password, user.password);

  if (!isMatch) {
    return next(new AppError('Password or email is not correct', 400));
  }
  // sign token
  const token = signToken(user._id);
  sendResponseFn(201, token, user, res);
});

// PROTECT ROUTE CONTROLLER
exports.protect = catchAsync(async (req, res, next) => {
  // check headers for authorization
  if (!req.headers && !req.headers.authorization) {
    return next(new AppError('Bad request: Please login to continue', 404));
  }
  const token = req.headers.authorization.split(' ')[1];

  // confirm if authorization token is real
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    return next(new AppError('jwt has expired', 404));
  }
  // check if user is was not deleted after token was assigned
  const user = await User.findOne({ _id: decoded.id });
  if (!user) {
    return next(
      new AppError('This user does not exist, please create account', 404),
    );
  }
  // check if user did not change password was just after token was assigned
  const isChange = user.compareLastChangePasswordTime(decoded.iat);
  if (isChange) {
    return next(new AppError('User password was changed', 400));
  }
  req.user = user;
  next();
});

// RESTRICTTO CONTROLLER
exports.restrictTo = (...roles) =>
  catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError(`Only ${roles[0]} can perform this action`));

    next();
  });

// FORGET PASSWORD CONTROLLER
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Email was not found', 404));
  }

  const user = await User.findOne({ email });
  const resetToken = user.generatePasswordResetToken();
  // persist changes on database
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/user/resetPassword/${resetToken}`;

  const message = `Forget your password? Submit a new PATCH request with your new password and passwordConfirm to: ${resetURL} \nIf you didn't forget you pasword, ignore this email`;

  // email response is a promise, and can throw errors so I needed to handle it explicitely
  try {
    await sendEmail({
      email: user.email,
      subject: 'Reset Password',
      message,
    });

    // send email response
    res.status(201).json({
      status: 'success',
      message: 'email has been sent!!!',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpireTime = undefined;
    await user.save();

    res.status(500).json({
      status: 'failed',
      message: 'Email not sent, try again later',
      error: error.message,
    });
  }
});

// RESET PASSWORD CONTROLLER
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { resetToken } = req.params;
  const { password, passwordConfirm } = req.body;

  if (!password || !passwordConfirm)
    return next(new AppError('Enter valid password or passwordConfirm'));

  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({ passwordResetToken });

  if (!user) {
    return next(
      new AppError(
        'This user does not exist, please create and account instead',
        404,
      ),
    );
  }

  if (!user.compareResetTokenTime())
    return next(new AppError('Reset Token has expired', 400));

  user.passwordConfirm = passwordConfirm;
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpireTime = undefined;
  user.passwordResetAt = Date.now();

  await user.save();
  const token = signToken(user._id);
  sendResponseFn(201, token, user, res);
});
