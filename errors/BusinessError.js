module.exports = class BusinessError extends Error {
  constructor (message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  getObject() {
    return {error: this.message}
  }
};