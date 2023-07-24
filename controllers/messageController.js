const Message = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { recieverId: recipient } = req.params;

  const uniqueId = uuidv4();

  console.log(uniqueId);

  // const message = await User.create({ ...req.body, recipient });

  res.status(201).json({
    stutus: 'success',
  });
});

exports.deleteMessage = catchAsync(async (req, res, next) => {});

exports.editMessage = catchAsync(async (req, res, next) => {});

exports.reportMessage = catchAsync(async (req, res, next) => {});
