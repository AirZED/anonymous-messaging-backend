const Message = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.sendMessage = catchAsync(async (req, res, next) => {
  res.send('message has been sent!!!');
});

exports.deleteMessage = catchAsync(async (req, res, next) => {});

exports.editMessage = catchAsync(async (req, res, next) => {});

exports.reportMessage = catchAsync(async (req, res, next) => {});
// exports.deleteMessage = ()
