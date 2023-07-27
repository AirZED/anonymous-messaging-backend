const Message = require('./../models/messageModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const crypto = require('crypto');

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { id: recipient } = req.params;
  const { uniqueId: sender } = req.user;

  const message = await Message.create({ ...req.body, recipient, sender });

  if (!message) {
    return next(new AppError('Message cannot be left blank'));
  }
  res.status(201).json({
    stutus: 'success',
    data: {
      message,
    },
  });
});

// FETCH MESSAGES SENT TO A SINGLE USER
exports.getMessagesSentToSingleUser = catchAsync(async (req, res, next) => {
  const { id: recipient } = req.params;
  const sender = crypto
    .createHash('sha256')
    .update(req.user.uniqueId)
    .digest('hex');

  const messages = await Message.find({
    sender,
    recipient,
  });

  if (!messages) {
    return next(new AppError('Messages not found', 404));
  }
  res.status(201).json({
    stutus: 'success',
    data: {
      messages,
    },
  });
});

// FETCH ALL MESSAGES FROM A SINGLE USER
exports.getMessagesFromSingleUser = catchAsync(async (req, res, next) => {
  const { id: anonymousId } = req.params;
  const { id } = req.user;

  const messages = await Message.find({ sender: anonymousId, recipient: id });

  if (!messages) {
    return next(new AppError('Messages not found', 404));
  }
  res.status(201).json({
    stutus: 'success',
    data: {
      messages,
    },
  });
});

// FETCH ALL SENT MESSAGES AND ARRANGE THEM PER USER
exports.fetchSentMessages = catchAsync(async (req, res, next) => {
  const message = await Message.find();

  if (!message) {
    return next(new AppError('Messages not found'));
  }
  res.status(200).json({
    stutus: 'success',
    data: {
      message,
    },
  });
});

exports.fetchSingleMessage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const message = await Message.findOne({ _id: id });

  if (!message) {
    return next(new AppError('Message not found'));
  }
  res.status(200).json({
    stutus: 'success',
    data: {
      message,
    },
  });
});
exports.deleteMessage = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const message = await Message.findByIdAndDelete(id);

  if (!message) {
    return next(new AppError('message does not exist'));
  }

  res.status(204).json({
    stutus: 'success',
    data: null,
  });
});

// YOU CAN ONLY EDIT MESSAGES YOU SENT
exports.editMessage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const sender = crypto
    .createHash('sha256')
    .update(req.user.uniqueId)
    .digest('hex');

  const message = await Message.findOneAndUpdate(
    { id, sender },
    req.body.message,
    {
      runValidators: true,
      returnDocument: 'after',
    },
  );

  if (!message) {
    return next(new AppError('Message not found'));
  }
  res.status(204).json({
    stutus: 'success',
    data: {
      message,
    },
  });
});

//REPORTING AND HANDLING REPORTED MESSAGES
exports.reportMessage = catchAsync(async (req, res, next) => {
  const { messageId: id } = req.params;

  const reported = { status: true, reportedBy: req.user.id, ...req.body };

  const message = await Message.findByIdAndUpdate(
    id,
    { reported },
    { returnDocument: 'after' },
  );

  if (!message) {
    return next(new AppError('Message not found'));
  }
  res.status(201).json({
    stutus: 'success',
    data: {
      message,
    },
  });
});



exports.getReportedMessages = catchAsync(async (req, res, next) => {
  console.log('Wetin I do you');

  // const messages = await Message.find({});

  // console.log(messages);

  res.send('Eh don dooo');
});

exports.handleReportedMessage = catchAsync(async (req, res, next) => {});
