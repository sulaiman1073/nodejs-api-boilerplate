const httpStatus = require("http-status");
const { isCelebrate } = require("celebrate");
const { MulterError } = require("multer");
const { ApiError } = require("../errors");
const {
  ApiErrorHandler,
  RequestValidationErrorHandler,
  MulterErrorHandler
} = require("../errorHandlers");

// eslint-disable-next-line no-unused-vars
module.exports = async (err, req, res, next) => {
  req.err = err;

  if (err instanceof MulterError) {
    return MulterErrorHandler(res, err);
  }

  if (err instanceof ApiError) {
    return ApiErrorHandler(res, err);
  }

  if (isCelebrate(err)) {
    return RequestValidationErrorHandler(res, err);
  }

  res.status(500).json({
    code: 500,
    error: httpStatus[500]
  });
};
