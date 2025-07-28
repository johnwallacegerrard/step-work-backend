class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this._statusCode = 401;
  }
}

module.exports = UnauthorizedError;