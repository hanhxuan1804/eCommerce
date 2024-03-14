const {
  StatusCodes,
  ReasonPhrases: ReasonStatusCodes,
} = require("../utils/httpStatusCode");

class ErrorResponse extends Error {
  constructor(statusCode, message) {
    super(message);
    this.status = statusCode;
    this.message = message;
  }
}

class ConflictResponseError extends ErrorResponse {
  constructor(message) {
    super(StatusCodes.CONFLICT, message || ReasonStatusCodes.CONFLICT);
  }
}

class ForbiddenResponseError extends ErrorResponse {
  constructor(message) {
    super(StatusCodes.FORBIDDEN, message || ReasonStatusCodes.FORBIDDEN);
  }
}

class NotFoundResponseError extends ErrorResponse {
  constructor(message) {
    super(StatusCodes.NOT_FOUND, message || ReasonStatusCodes.NOT_FOUND);
  }
}

class InternalServerError extends ErrorResponse {
  constructor(message) {
    super(
      StatusCodes.INTERNAL_SERVER_ERROR,
      message || ReasonStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

class UnauthorizedResponseError extends ErrorResponse {
  constructor(message) {
    super(StatusCodes.UNAUTHORIZED, message || ReasonStatusCodes.UNAUTHORIZED);
  }
}

class BadRequestResponseError extends ErrorResponse {
  constructor(message) {
    super(StatusCodes.BAD_REQUEST, message || ReasonStatusCodes.BAD_REQUEST);
  }
}

module.exports = {
  ErrorResponse,
  ConflictResponseError,
  ForbiddenResponseError,
  NotFoundResponseError,
  InternalServerError,
  UnauthorizedResponseError,
  BadRequestResponseError,
  StatusCode: StatusCodes,
  ReasonStatusCodes,
};
