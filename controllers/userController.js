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

exports.getAllUsers = async () => {
  const allUsers = await User.find();

  if (!allUsers) {
    return next(new AppError('Users not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      allUsers,
    },
  });
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

  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync((req, res, next) => {});
