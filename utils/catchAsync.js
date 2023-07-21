const catchAsync = (callbackFn) => {
  return (req, res, next) =>
    callbackFn(req, res, next).catch((error) => next(error));
};

module.exports = catchAsync;
