const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const filterRequestObject = (obj, ...allowedfields) => {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedfields.includes(el)) {
      newObject[el] = obj[el];
    }
  });
  return newObject;
};

const sendResponseFn = (statusCode, data, res) => {
  res.status(statusCode).json({
    status: 'success',
    data: {
      data,
    },
  });
};

exports.getAllUsers = async () => {
  const allUsers = await User.find();

  if (!allUsers) {
    return next(new AppError('Users not found', 404));
  }
  sendResponseFn(200, allUsers, res);
};

exports.updateUserDetails = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const userDetails = filterRequestObject(req.body, 'photo', 'name');

  // update user details except the password and other sensitive details
  const user = await User.findByIdAndUpdate(id, userDetails, {
    runValidators: true,
    returnDocument: 'after',
  });

  if (!user) {
    return next(new AppError('User not found'));
  }

  sendResponseFn(201, user, res);
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return next(new AppError('User not found'));
  }
  sendResponseFn(204, null, res);
});
