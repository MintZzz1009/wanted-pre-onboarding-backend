const {
  StatusCodes: { INTERNAL_SERVER_ERROR },
} = require('http-status-codes');
const { ApiError, NotFoundError } = require('../utils/apiError');

class ErrorHandler {
  static handle = async (err, req, res, next) => {
    const statusCode = err.statusCode || INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
      name: err.name,
      success: false,
      message: err.message,
      stack: err.stack,
    });
  };

  static initializeUnhandledException = () => {
    process.on('unhandledRejection', (reason, promise) => {
      console.log(reason.name, reason.message);
      console.log('UNHANDLED REJECTION! 💥 Shutting down...');
      throw reason;
    });

    process.on('uncaughtException', (err) => {
      console.log(err.name, err.message);
      console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
      process.exit(1);
    });
  };
}

module.exports = ErrorHandler;
