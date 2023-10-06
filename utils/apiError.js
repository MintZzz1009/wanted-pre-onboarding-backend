const {
  StatusCodes: { NOT_FOUND },
} = require('http-status-codes');

export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends ApiError {
  constructor(path) {
    super(NOT_FOUND, `요청하신 URL: ${path}이 존재하지 않습니다.`);
  }
}

export class ValidationError extends ApiError {
  constructor(message) {
    super(BAD_REQUEST, message);
  }
}

export class TokenServiceError extends ApiError {
  constructor(statusCode, message) {
    super(statusCode, message);
  }
}

export class ApplicationError extends ApiError {
  constructor(statusCode, message) {
    super(statusCode, message);
  }
}
