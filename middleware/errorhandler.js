const {
  StatusCodes: { INTERNAL_SERVER_ERROR },
} = require('http-status-codes');

class ErrorHandler {
  static handle = async (err, req, res, next) => {
    const statusCode = err.statusCode || INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
      success: false,
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
  };

  static initializeUnhandledException = () => {
    process.on('unhandledRejection', (reason, promise) => {
      console.log(reason.name, reason.message);
      console.log('Unhandled Rejection! 🚫 프로그램 종료중...');
      throw reason;
    });

    process.on('uncaughtException', (err) => {
      console.log(err.name, err.message);
      console.log('Uncaught Exception! 🚫 프로그램 종료중...');
      process.exit(1);
    });
  };
}

module.exports = ErrorHandler;
