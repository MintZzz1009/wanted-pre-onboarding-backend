const {
  StatusCodes: { NOT_FOUND, BAD_REQUEST },
} = require('http-status-codes');

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends ApiError {
  constructor(path) {
    super(NOT_FOUND, `요청하신 URL: ${path}이 존재하지 않습니다.`);
  }
}

class ValidationError extends ApiError {
  constructor(message) {
    super(BAD_REQUEST, message);
  }
}

class TokenServiceError extends ApiError {
  constructor(statusCode, message) {
    super(statusCode, message);
  }
}

class ApplicationError extends ApiError {
  constructor(statusCode, message) {
    super(statusCode, message);
  }
}

module.exports = {
  ApiError,
  NotFoundError,
  ValidationError,
  TokenServiceError,
  ApplicationError,
};
