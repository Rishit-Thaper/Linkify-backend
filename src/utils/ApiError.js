class ApiError extends Error {
  constructor(statusCode, message = "", error = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    this.data = null;
    this.message = message;
    this.success = false;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      error: this.error,
      data: this.data,
      success: this.success,
    };
  }
}
export default ApiError;
