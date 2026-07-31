// utils/errorHelper.js
const sendError = (res, statusCode, message, errorDetails = null) => {
  res.status(statusCode).json({
    message,
    error: errorDetails ? errorDetails.message : null,
  });
};

module.exports = { sendError };
