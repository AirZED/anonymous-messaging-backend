const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});
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

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

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
  const user = User.findOne(decoded.id);
  if (!user) {
    return next(
      new AppError('This user does not exist, please create account', 404),
    );
  }
  // check if user did not change password was just after token was assigned

  user.compareLastChangePasswordTime(decoded.iat, req.passwordResetAt);

  next();
});
