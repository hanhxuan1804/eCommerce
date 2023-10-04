const {
  StatusCodes,
  ReasonPhrases: ReasonStatusCodes,
} = require("../utils/httpStatusCode");

class SuccessResponse {
  constructor(statusCode, message, metadata) {
    this.status = statusCode;
    this.message = message;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.status).json({
      message: this.message,
      metadata: this.metadata,
    });
  }
}

class OkResponse extends SuccessResponse {
  constructor(message, metadata) {
    super(StatusCodes.OK, message || ReasonStatusCodes.OK, metadata);
  }
}

class CreatedResponse extends SuccessResponse {
  constructor(message, metadata) {
    super(StatusCodes.CREATED, message || ReasonStatusCodes.CREATED, metadata);
  }
}


module.exports = {
  SuccessResponse,
  OkResponse,
  CreatedResponse,
  StatusCode: StatusCodes,
  ReasonStatusCodes,
};
